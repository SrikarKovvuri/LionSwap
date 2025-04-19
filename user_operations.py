from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Product, Order, User

market_ops = Blueprint("market_operations", __name__)

# publicly list all product listings with optional filtering by keyword or condition
@market_ops.route('/listings', methods=['GET'])
def get_listings():
    keyword = request.args.get("keyword", "").strip() # OPTIONAL
    condition_filter = request.args.get("condition") # OPTIONAL
    
    query = Product.query
    if keyword:
        query = query.filter(Product.title.ilike(f"%{keyword}%"))
    if condition_filter:
        query = query.filter_by(condition=condition_filter)
    products = query.all()
    return jsonify({"listings": [product.to_dict() for product in products]}), 200

# retrieve details for a specific product
@market_ops.route('/listings/<int:listing_id>', methods=['GET'])
def get_listing(listing_id):
    product = Product.query.get(listing_id)
    if not product:
        return jsonify({"error": "Listing not found"}), 404
    return jsonify({"listing": product.to_dict()}), 200

# create a new product listing (Seller must be authenticated)
@market_ops.route('/listings', methods=['POST'])
@jwt_required()
def create_listing():
    seller_id = get_jwt_identity()  
    data = request.get_json() or {}
    title = data.get("title")
    description = data.get("description", "")
    price = data.get("price")            
    condition = data.get("condition")    
    image_url = data.get("image_url")    

    if not title or price is None or not condition:
        return jsonify({"error": "Title, price, and condition are required"}), 400
    
    user = User.query.filter_by(id=seller_id).first()
    username = user.username

    product = Product(
        seller_id=seller_id,
        seller_username=username,
        title=title,
        description=description,
        price=price,
        condition=condition,
        image_url=image_url,
        is_available=True
    )
    db.session.add(product)
    try:
        db.session.commit()

        #build a response dict by hand: 
        listing_data = {
            "id":           product.id,
            "seller_id":    product.seller_id,
            "title":        product.title,
            "description":  product.description,
            "price":        product.price,
            "condition":    product.condition,
            "image_url":    product.image_url,
            "is_available": product.is_available,
            "posted_at":    product.posted_at.isoformat()
        }
        return jsonify({"message": "Listing created", "listing": listing_data}), 201
    except Exception as err:
        db.session.rollback()
        return jsonify({"error": "Database error: " + str(err)}), 500

    return jsonify({"message": "Listing created", "listing": product.to_dict()}), 201
#update a product listing (owner-only)
@market_ops.route('/listings/<int:listing_id>', methods=['PUT'])
@jwt_required()
def update_listing(listing_id):
    seller_id = get_jwt_identity()
    product = Product.query.get(listing_id)
    if not product:
        return jsonify({"error": "Listing not found"}), 404
    if product.seller_id != seller_id:
        return jsonify({"error": "Unauthorized access"}), 403

    data = request.get_json() or {}
    product.title = data.get("title", product.title)
    product.description = data.get("description", product.description)
    product.price = data.get("price", product.price)
    product.condition = data.get("condition", product.condition)
    product.image_url = data.get("image_url", product.image_url)
    
    try:
        db.session.commit()
    except Exception as err:
        db.session.rollback()
        return jsonify({"error": "Database error: " + str(err)}), 500

    return jsonify({"message": "Listing updated", "listing": product.to_dict()}), 200

# delete a product listing (owner-only)
@market_ops.route('/listings/<int:listing_id>', methods=['DELETE'])
@jwt_required()
def delete_listing(listing_id):
    seller_id = get_jwt_identity()
    product = Product.query.get(listing_id)
    if not product:
        return jsonify({"error": "Listing not found"}), 404
    if product.seller_id != seller_id:
        return jsonify({"error": "Unauthorized access"}), 403

    try:
        db.session.delete(product)
        db.session.commit()
    except Exception as err:
        db.session.rollback()
        return jsonify({"error": "Database error: " + str(err)}), 500

    return jsonify({"message": "Listing deleted"}), 200

# Create a new order when a buyer purchases a product
@market_ops.route('/orders', methods=['POST'])
@jwt_required()
def create_order():
    buyer_id = get_jwt_identity()  
    data = request.get_json() or {}
    product_id = data.get("product_id")
    quantity = data.get("quantity", 1) 
    if not product_id:
        return jsonify({"error": "Product ID is required"}), 400

    product = Product.query.get(product_id)
    if not product:
        return jsonify({"error": "Listing not found"}), 404

    # Calculate total cost (here, price is assumed to be in dollars; adjust accordingly if stored in cents)
    total = product.price * quantity

    order = Order(
        buyer_id=buyer_id,
        product_id=product_id,
        quantity=quantity,
        total=total,
        status="Pending"
    )
    db.session.add(order)
    try:
        db.session.commit()
    except Exception as err:
        db.session.rollback()
        return jsonify({"error": "Database error: " + str(err)}), 500

    return jsonify({"message": "Order created", "order": order.to_dict()}), 201

# Retrieve order details (accessible to buyer or the seller for the product)
@market_ops.route('/orders/<int:order_id>', methods=['GET'])
@jwt_required()
def get_order(order_id):
    user_id = get_jwt_identity()
    order = Order.query.get(order_id)
    if not order:
        return jsonify({"error": "Order not found"}), 404

    product = Product.query.get(order.product_id)
    # allow access if the logged-in user is either the buyer or the seller of the product
    if order.buyer_id != user_id and product.seller_id != user_id:
        return jsonify({"error": "Unauthorized to view this order"}), 403

    return jsonify({"order": order.to_dict()}), 200

@market_ops.route("/users/profile", methods=["GET"])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()  # gets the user ID from the JWT
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify({"user": user.to_dict()}), 200

@market_ops.route("/users/profile", methods=["PUT"])
@jwt_required()
def update_profile():
    """
    Update the profile of the currently authenticated user.
    """
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json() or {}
    user.username = data.get("username", user.username) 

    try:
        db.session.commit()
    except Exception as err:
        db.session.rollback()
        return jsonify({"error": "Database error: " + str(err)}), 500

    return jsonify({"message": "User updated successfully", "user": user.to_dict()}), 200

# DELETE /users/profile
@market_ops.route("/users/profile", methods=["DELETE"])
@jwt_required()
def delete_profile():
    
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    try:
        db.session.delete(user)
        db.session.commit()
    except Exception as err:
        db.session.rollback()
        return jsonify({"error": "Database error: " + str(err)}), 500

    return jsonify({"message": "User deleted successfully"}), 200



# GET retrieved listings from VectorDB query
@market_ops.route("/search", methods=["GET"])
def vector_search(query):

    listings = []

    return jsonify(listings), 200