from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Listing, Order

market_ops = Blueprint("market_operations", __name__)



@market_ops.route('/listings', methods=['GET'])
def get_listings():
    
    category = request.args.get("category")
    keyword = request.args.get("keyword")
    query = Listing.query
    if category:
        query = query.filter_by(category=category)
    if keyword:
        query = query.filter(Listing.title.ilike(f"%{keyword}%"))
    listings = query.all()
    return jsonify({"listings": [listing.to_dict() for listing in listings]}), 200

#  Retrieve details for a specific listing
@market_ops.route('/listings/<int:listing_id>', methods=['GET'])
def get_listing(listing_id):
    listing = Listing.query.get(listing_id)
    if not listing:
        return jsonify({"error": "Listing not found"}), 404
    return jsonify({"listing": listing.to_dict()}), 200

# Create a new listing (Seller must be authenticated)
@market_ops.route('/listings', methods=['POST'])
@jwt_required()
def create_listing():
    seller_id = get_jwt_identity()  
    data = request.get_json() or {}
    title = data.get("title")
    description = data.get("description", "")
    price = data.get("price")  
    category = data.get("category")

    if not title or not price:
        return jsonify({"error": "Title and price are required"}), 400

    listing = Listing(
        seller_id=seller_id,
        title=title,
        description=description,
        price=price,
        category=category
    )
    db.session.add(listing)
    try:
        db.session.commit()
    except Exception as err:
        db.session.rollback()
        return jsonify({"error": "Database error: " + str(err)}), 500

    return jsonify({"message": "Listing created", "listing": listing.to_dict()}), 201


@market_ops.route('/listings/<int:listing_id>', methods=['PUT'])
@jwt_required()
def update_listing(listing_id):
    seller_id = get_jwt_identity()
    listing = Listing.query.get(listing_id)
    if not listing:
        return jsonify({"error": "Listing not found"}), 404
    if listing.seller_id != seller_id:
        return jsonify({"error": "Unauthorized access"}), 403

    data = request.get_json() or {}
    listing.title = data.get("title", listing.title)
    listing.description = data.get("description", listing.description)
    listing.price = data.get("price", listing.price)
    listing.category = data.get("category", listing.category)
    
    try:
        db.session.commit()
    except Exception as err:
        db.session.rollback()
        return jsonify({"error": "Database error: " + str(err)}), 500

    return jsonify({"message": "Listing updated", "listing": listing.to_dict()}), 200

#  Delete a listing (owner-only)
@market_ops.route('/listings/<int:listing_id>', methods=['DELETE'])
@jwt_required()
def delete_listing(listing_id):
    seller_id = get_jwt_identity()
    listing = Listing.query.get(listing_id)
    if not listing:
        return jsonify({"error": "Listing not found"}), 404
    if listing.seller_id != seller_id:
        return jsonify({"error": "Unauthorized access"}), 403

    try:
        db.session.delete(listing)
        db.session.commit()
    except Exception as err:
        db.session.rollback()
        return jsonify({"error": "Database error: " + str(err)}), 500

    return jsonify({"message": "Listing deleted"}), 200


# Create a new order when a buyer purchases a listing
@market_ops.route('/orders', methods=['POST'])
@jwt_required()
def create_order():
    buyer_id = get_jwt_identity()  # The buyer's user ID
    data = request.get_json() or {}
    listing_id = data.get("listing_id")
    quantity = data.get("quantity", 1)  # Default quantity is 1
    if not listing_id:
        return jsonify({"error": "Listing ID is required"}), 400

    listing = Listing.query.get(listing_id)
    if not listing:
        return jsonify({"error": "Listing not found"}), 404

    
    total = listing.price * quantity

    order = Order(
        buyer_id=buyer_id,
        listing_id=listing_id,
        quantity=quantity,
        total=total,
        status="pending"  # initial status but update after payment confirmation, etc.
    )
    db.session.add(order)
    try:
        db.session.commit()
    except Exception as err:
        db.session.rollback()
        return jsonify({"error": "Database error: " + str(err)}), 500

    return jsonify({"message": "Order created", "order": order.to_dict()}), 201

# Retrieve order details (accessible to buyer or seller of the listing)
@market_ops.route('/orders/<int:order_id>', methods=['GET'])
@jwt_required()
def get_order(order_id):
    user_id = get_jwt_identity()
    order = Order.query.get(order_id)
    if not order:
        return jsonify({"error": "Order not found"}), 404

    listing = Listing.query.get(order.listing_id)
    # Allow access if the logged-in user is the buyer or the seller associated with the listing
    if order.buyer_id != user_id and listing.seller_id != user_id:
        return jsonify({"error": "Unauthorized to view this order"}), 403

    return jsonify({"order": order.to_dict()}), 200
