from flask import Blueprint, jsonify, request, json
from models import User, db
from auth import send_email
import stripe
import os
from flask_jwt_extended import get_jwt_identity, jwt_required
from dotenv import load_dotenv


load_dotenv()
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

stripe_bp = Blueprint('stripe', __name__)

@stripe_bp.route("/create-checkout-session", methods=['POST'])
@jwt_required()
def create_checkout_session():
    try:
        # force=True will parse JSON even if the header is missing/malformed
        payload = request.get_json(force=True) or {}
        items = payload.get("items", [])
        if not isinstance(items, list) or not items:
            return jsonify({"error": "No items provided"}), 400

        # only support one item for now
        item = items[0]
        if "price" not in item or "sellerAccount" not in item:
            return jsonify({"error": "Invalid item data"}), 400

        # dollars → cents
        try:
            price_cents = int(item["price"] * 100)
        except Exception:
            return jsonify({"error": "Invalid price value"}), 400

        seller_account_id = item["sellerAccount"]
        if not seller_account_id:
            return jsonify({"error": "Seller account ID missing"}), 400

        # your 10% platform cut
        platform_fee_cents = int(price_cents * 0.10)

        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            mode="payment",
            line_items=[{
                "price_data": {
                    "currency": "usd",
                    "product_data": {"name": item.get("title", "Item")},
                    "unit_amount": price_cents,
                },
                "quantity": 1,
            }],
            payment_intent_data={
                "application_fee_amount": platform_fee_cents,
                "transfer_data": {"destination": seller_account_id},
            },
            success_url="http://localhost:3000/payment/success?session_id={CHECKOUT_SESSION_ID}",
            cancel_url="http://localhost:3000/payment/cancel",
        )

        buyer_id = get_jwt_identity()
        buyer = User.query.get(buyer_id)
        seller = User.query.filter_by(seller_account_id=seller_account_id)

        send_email(buyer.email, "Seller Contact Info for " + item["title"], "Seller Phone Number: " + seller.phone + "\n\n" + "Seller Email: " + seller.email)

        return jsonify({"url": session.url}), 200

    except stripe.error.InvalidRequestError as e:
        # A Stripe-specific error (like "invalid destination account")
        return jsonify({"error": e.user_message or str(e)}), 400

    except Exception as err:
        # Anything else
        print("⚠️ create-checkout-session error:", err)
        return jsonify({"error": str(err)}), 400


@stripe_bp.route("/onboard", methods=[ "POST"])
@jwt_required()
def onboard():
    # 1) CORS preflight

    user = User.query.get_or_404(get_jwt_identity())

    # where to send them afterwards
    BASE_URL = os.getenv("MARKETPLACE_URL", "https://discuss.python.org/t/installing-dotenv-vs-load-dotenv-why/51024")

    # 2) Make sure we have a Stripe account ID
    if not user.stripe_account_id:
        acct = stripe.Account.create(
            type="express",
            business_profile={"url": f"{BASE_URL}/seller/{user.id}"},
        )
        user.stripe_account_id = acct.id
        db.session.commit()
    else:
        # retrieve the existing account
        acct = stripe.Account.retrieve(user.stripe_account_id)
        # update their business_profile in case your URL changed
        stripe.Account.modify(
            acct.id,
            business_profile={"url": f"{BASE_URL}/seller/{user.id}"},
        )

    # 3) If they can already charge, nothing to do
    if acct.charges_enabled:
        return jsonify({"url": None}), 200

    # 4) Otherwise generate an onboarding link
    link = stripe.AccountLink.create(
        account=acct.id,
        refresh_url=f"{BASE_URL}/onboarding/refresh",
        return_url=f"{BASE_URL}/onboarding/success",
        type="account_onboarding",
    )
    return jsonify({"url": link.url}), 200


@stripe_bp.route("/webhook", methods=["POST"])
def stripe_webhook():
    payload = request.data
    sig_header = request.headers["Stripe-Signature"]
    event = stripe.Webhook.construct_event(payload, sig_header, WEBHOOK_SECRET)

    if event["type"] == "checkout.session.completed":
        sess = event["data"]["object"]
        items = json.loads(sess["metadata"]["items"])

        # For each item: transfer the seller’s share
        for it in items:
            amount = int(it["price"] * 100)
            seller = it["sellerAccount"]
            stripe.Transfer.create(
                amount=amount,
                currency="usd",
                destination=seller,
                source_transaction=sess["payment_intent"],
            )
    return "", 200