from app import app
from models import db, Product

products = [
    {
        "id": 1,
        "title": "Introduction to Economics Textbook",
        "price": 45.0,
        "description": "Used textbook for ECON1001. Some highlighting but in good condition. 10th edition.",
        "image_url": "/placeholder.svg?height=400&width=400",
        "category": "Textbooks",
        "condition": "good",
        "is_available": True,
        "posted_at": "2025-04-01T09:15:00Z",
        "seller_id": 1,
        "seller_username": "alexj",
    },
    {
        "id": 2,
        "title": "MacBook Air 2021",
        "price": 750.0,
        "description": "M1 MacBook Air, 8GB RAM, 256GB SSD. Includes charger and protective case.",
        "image_url": "/placeholder.svg?height=400&width=400",
        "category": "Electronics",
        "condition": "like_new",
        "is_available": True,
        "posted_at": "2025-04-02T11:30:00Z",
        "seller_id": 2,
        "seller_username": "jamies",
    },
    {
        "id": 3,
        "title": "Columbia University Hoodie",
        "price": 25.0,
        "description": "Official Columbia University hoodie, size medium. Worn a few times but still in great condition.",
        "image_url": "/placeholder.svg?height=400&width=400",
        "category": "Clothing",
        "condition": "good",
        "is_available": True,
        "posted_at": "2025-04-03T14:20:00Z",
        "seller_id": 1,
        "seller_username": "alexj",
    },
    {
        "id": 4,
        "title": "Desk Lamp",
        "price": 15.0,
        "description": "Adjustable desk lamp, perfect for dorm rooms. LED bulb included.",
        "image_url": "/placeholder.svg?height=400&width=400",
        "category": "Dorm Essentials",
        "condition": "good",
        "is_available": True,
        "posted_at": "2025-04-04T16:45:00Z",
        "seller_id": 2,
        "seller_username": "jamies",
    },
    {
        "id": 5,
        "title": "Calculus Early Transcendentals",
        "price": 50.0,
        "description": "8th edition, James Stewart. Used for MATH1101. Minor wear on cover.",
        "image_url": "/placeholder.svg?height=400&width=400",
        "category": "Textbooks",
        "condition": "good",
        "is_available": True,
        "posted_at": "2025-04-05T10:10:00Z",
        "seller_id": 1,
        "seller_username": "alexj",
    },
    {
        "id": 6,
        "title": "Wireless Headphones",
        "price": 80.0,
        "description": "Sony WH-1000XM3 Noise Cancelling Headphones. Great condition with carrying case.",
        "image_url": "/placeholder.svg?height=400&width=400",
        "category": "Electronics",
        "condition": "good",
        "is_available": True,
        "posted_at": "2025-04-06T13:25:00Z",
        "seller_id": 2,
        "seller_username": "jamies",
    },
    {
        "id": 7,
        "title": "Columbia Lions Basketball Jersey",
        "price": 35.0,
        "description": "Official Columbia Lions basketball jersey, size large. Like new condition.",
        "image_url": "/placeholder.svg?height=400&width=400",
        "category": "Clothing",
        "condition": "like_new",
        "is_available": True,
        "posted_at": "2025-04-07T09:50:00Z",
        "seller_id": 1,
        "seller_username": "alexj",
    },
    {
        "id": 8,
        "title": "Mini Refrigerator",
        "price": 65.0,
        "description": "Compact refrigerator, perfect for dorm rooms. 2.7 cubic feet with freezer compartment.",
        "image_url": "/placeholder.svg?height=400&width=400",
        "category": "Dorm Essentials",
        "condition": "good",
        "is_available": False,
        "posted_at": "2025-04-08T15:35:00Z",
        "seller_id": 2,
        "seller_username": "jamies",
    },
]

# Add to the database
with app.app_context():
    for item in products:
        product = Product(
            seller_id=item["seller_id"],
            seller_username=item["seller_username"],
            title=item["title"],
            description=item["description"],
            price=item["price"],
            condition=item["condition"],
            image_url=item["image_url"],
            is_available=item["is_available"],
            category=item["category"],
            posted_at=item["posted_at"]
        )
        db.session.add(product)

    db.session.commit()
