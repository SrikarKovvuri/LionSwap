from flask import Blueprint, jsonify, request
from models import User, db
import stripe
import os
from flask_jwt_extended import get_jwt_identity, jwt_required

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

stripe_bp = Blueprint('stripe', __name__)

@stripe_bp.route("/create-checkout-session", methods=['POST'])
@jwt_required()
def create_checkout_session():
    try:
        data = request.get_json()                  # ← use get_json(), not request.json()
        price = int(data["price"] * 100)           # ← convert dollars to cents
        seller_account_id = data["sellerAccount"]
        platform_fee_cents = int(0.9 * price)      # ← your 90% cut in cents

        # line_items must be a list of dicts
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            mode="payment",
            line_items=[{
                "price_data": {
                    "currency": "usd",
                    "product_data": {"name": data.get("productName", "Item")},
                    "unit_amount": price
                },
                "quantity": 1
            }],
            payment_intent_data={
                "application_fee_amount": platform_fee_cents,
                "transfer_data": {
                    "destination": seller_account_id,
                },
            },
            success_url="http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}",
            cancel_url="http://localhost:3000/cancel",
        )
        return jsonify({"url": session.url}), 200

    except Exception as err:
        return jsonify({"error": str(err)}), 400


@stripe_bp.route("/onboard", methods=['POST'])
@jwt_required()
def onboard():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    # If they already have a stripe_account_id, reuse it
    if user.stripe_account_id:
        account_id = user.stripe_account_id
    else:
        account = stripe.Account.create(type="express")
        account_id = account.id
        user.stripe_account_id = account_id
        db.session.commit()

    account_link = stripe.AccountLink.create(
        account=account_id,
        refresh_url="http://localhost:3000/onboard/refresh",
        return_url="http://localhost:3000/onboard/success",
        type="account_onboarding"
    )
    return jsonify({"url": account_link.url}), 200


@stripe_bp.route("/webhook", methods=['POST'])
def stripe_webhook():
    payload = request.data
    sig_header = request.headers.get("Stripe-Signature")
    webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET")

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, webhook_secret)
    except stripe.error.SignatureVerificationError:
        return "Invalid signature", 400

    # Process relevant events.
    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        # mark_order_paid(session["id"])
        print("Payment succeeded for session", session["id"])
    elif event["type"] == "charge.refunded":
        charge = event["data"]["object"]
        print("Charge was refunded:", charge["id"])
    # …handle other events as needed.

    return "", 200
