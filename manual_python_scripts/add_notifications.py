from datetime import datetime
import sys
import os

# Add parent directory to Python path to import app
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import app
from models import db, Notification

notifications = [
    {
        "id": 1,
        "user_id": 1,
        "type": "message",
        "title": "New message from Jamie Smith",
        "message": "Hey, is the textbook still available?",
        "received_at": "2025-04-17T10:30:00Z",
        "read": False,
        "action_url": "/messages/jamies",
        "sender_id": 2,
        "image_url": "/placeholder.svg"
    },
    {
        "id": 2,
        "user_id": 1,
        "type": "offer",
        "title": "New offer on 'Calculus Early Transcendentals'",
        "message": "Jamie has made an offer of $40 for your textbook.",
        "received_at": "2025-04-17T08:15:00Z",
        "read": False,
        "action_url": "/listings/offers/1",
        "sender_id": 2,
        "product_id": 5,
        "image_url": "/placeholder.svg"
    },
    {
        "id": 3,
        "user_id": 1,
        "type": "purchase",
        "title": "Your item has been purchased!",
        "message": "Jamie has purchased your 'Intro to Psychology' textbook for $25.",
        "received_at": "2025-04-16T14:45:00Z",
        "read": True,
        "action_url": "/sales/123",
        "sender_id": 2,
        "product_id": 9,
        "image_url": "/placeholder.svg"
    },
    {
        "id": 4,
        "user_id": 1,
        "type": "system",
        "title": "Welcome to LionSwap!",
        "message": "Start buying and selling items within the Columbia community today.",
        "received_at": "2025-04-15T09:00:00Z",
        "read": True,
        "action_url": "/getting-started",
        "image_url": "/placeholder.svg"
    },
    {
        "id": 5,
        "user_id": 1,
        "type": "price_drop",
        "title": "Price drop alert!",
        "message": "A Samsung monitor you viewed has dropped in price by $20.",
        "received_at": "2025-04-15T11:30:00Z",
        "read": False,
        "action_url": "/product/monitor123",
        "product_id": 10,
        "image_url": "/placeholder.svg"
    },
    {
        "id": 6,
        "user_id": 2,
        "type": "message",
        "title": "New message from Alex Johnson",
        "message": "Thanks for your interest! Yes, the textbook is still available.",
        "received_at": "2025-04-17T11:15:00Z",
        "read": False,
        "action_url": "/messages/alexj",
        "sender_id": 1,
        "image_url": "/placeholder.svg"
    },
    {
        "id": 7,
        "user_id": 2,
        "type": "system",
        "title": "Your listing is about to expire",
        "message": "Your 'Dorm Desk Lamp' listing will expire in 3 days. Consider refreshing it.",
        "received_at": "2025-04-16T16:00:00Z",
        "read": True,
        "action_url": "/listings/my-listings",
        "product_id": 4,
        "image_url": "/placeholder.svg"
    },
    {
        "id": 8,
        "user_id": 2,
        "type": "purchase",
        "title": "Purchase successful!",
        "message": "You've successfully purchased 'Calculus Textbook' from Alex.",
        "received_at": "2025-04-15T13:45:00Z",
        "read": True,
        "action_url": "/purchases/456",
        "sender_id": 1,
        "product_id": 5,
        "image_url": "/placeholder.svg"
    }
]

with app.app_context():
    for item in notifications:
        notification = Notification(
            id=item["id"],
            user_id=item["user_id"],
            type=item["type"],
            title=item["title"],
            message=item["message"],
            received_at=datetime.strptime(item["received_at"], "%Y-%m-%dT%H:%M:%SZ"),
            read=item["read"],
            action_url=item.get("action_url"),
            sender_id=item.get("sender_id"),
            product_id=item.get("product_id"),
            image_url=item.get("image_url")
        )
        db.session.add(notification)

    db.session.commit()
