from flask import Blueprint, jsonify, request
from models import User, db
import stripe

stripe_bp = Blueprint('stripe', __name__)


def create_checkout_session():

    try:
        data = request.get_json()
        amount = data.get("amount")                  
        seller_account_id = data.get("seller_account_id")  
        success_url = data.get("success_url")            
        cancel_url = data.get("cancel_url")            
        application_fee_amount = data.get("application_fee_amount", 0)  
        
        session = stripe.checkout.sessions.create(
            payment_method_types=["card"],
            line_items=[{
                "price_data": {
                    "currency": "usd",
                    "product_data": {
                        "name": "Your Product Name", 
                    },
                    "unit_amount": amount,
                },
                "quantity": 1,  
            }],
            mode="payment",
            success_url=success_url,
            cancel_url=cancel_url,
            payment_intent_data={
                
                "transfer_data": {
                    "destination": seller_account_id
                },
                
                "application_fee_amount": application_fee_amount,
            },
        )

        return jsonify({"url": session.url})
    except Exception as e:
        print("Error creating Checkout Session:", e)
        return jsonify({"error": str(e)}), 400

def stripe_webhook():
    payload = request.data
    sig_header = request.headers.get("stripe-signature")
    webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET")

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, webhook_secret)
    except stripe.error.SignatureVerificationError:
        return "Invalid signature", 400

    # Process relevant events.
    if event["type"] == "payment_intent.succeeded":
        print("Payment succeeded")
        # Update your order status here.
    elif event["type"] == "charge.refunded":
        print("Charge was refunded")
        # Update your refund records.
    # Handle other event types as needed.

    return "ok", 200




