from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Product, Order, User, Notification

market_ops = Blueprint("market_operations", __name__)

@market_ops.route('/', methods=[])
def home():
    return jsonify({"message": "Flask backend server is running successfully"}), 200

# publicly list all product listings with optional filtering by keyword or condition
@market_ops.route('/listings', methods=['GET'])
def get_listings():
    
    query = Product.query

    products = query.limit(20).all()

    listings = []
    for p in products:
        listings.append({
            "id":           p.id,
            "sellerId":    p.seller_id,
            "sellerUsername": p.seller_username,
            "title":        p.title,
            "description":  p.description,
            "price":        p.price,
            "category":     p.category,
            "condition":    p.condition,
            "imageUrls":    p.image_urls or [],
            "isAvailable": p.is_available,
            "timestamp":    p.posted_at.isoformat() if p.posted_at else None
        })

    return jsonify({"listings": listings}), 200

# retrieve details for a specific product
@market_ops.route('/listings/<int:listing_id>', methods=['GET'])
def get_listing(listing_id):
    product = Product.query.get(listing_id)
    if not product:
        return jsonify({"error": "Listing not found"}), 404
    
    listing = {
        "id":           product.id,
        "sellerId":    product.seller_id,
        "sellerUsername":    product.seller_username,
        "title":        product.title,
        "description":  product.description,
        "price":        product.price,
        "category":     product.category,
        "condition":    product.condition,
        "imageUrls":    product.image_urls or [],
        "isAvailable": product.is_available,
        "timestamp":    product.posted_at.isoformat() if product.posted_at else None
    }
    return jsonify({"listing": listing}), 200

# retrieve products of a specific category
@market_ops.route('/listings/category/<category>', methods=['GET'])
def get_listing_by_category(category):
    products = Product.query.filter_by(category=category).limit(50).all()
    listings = []
    for p in products:
        listings.append({
            "id":           p.id,
            "sellerId":    p.seller_id,
            "sellerUsername": p.seller_username,
            "title":        p.title,
            "description":  p.description,
            "price":        p.price,
            "category":     p.category,
            "condition":    p.condition,
            "imageUrls":    p.image_urls or [],
            "isAvailable": p.is_available,
            "timestamp":    p.posted_at.isoformat() if p.posted_at else None
        })

    return jsonify({"listings": listings}), 200

# retrieve products of a specific username
@market_ops.route('/listings/username/<username>', methods=['GET'])
def get_listing_by_username(username):
    print("/" + username + "/")
    user = User.query.filter_by(username=username).first()

    if not user:
        return jsonify({"listings": {}, "user": {}}), 401

    products = Product.query.filter_by(seller_id=user.id).all()
    listings = []
    for p in products:
        listings.append({
            "id":           p.id,
            "sellerId":    p.seller_id,
            "sellerUsername": p.seller_username,
            "title":        p.title,
            "description":  p.description,
            "price":        p.price,
            "category":     p.category,
            "condition":    p.condition,
            "imageUrls":    p.image_urls or [],
            "isAvailable": p.is_available,
            "timestamp":    p.posted_at.isoformat() if p.posted_at else None
        })
    
    user_data = {
        "username": user.username,
        "password_hash": user.password_hash,
        "timestamp": user.created_at.isoformat()
    } 
    return jsonify({"listings": listings, "user": user_data}), 200

# retrieve products by a specific user
@market_ops.route('/listings/specific/user', methods=['GET', 'OPTIONS'])
@jwt_required()
def get_listing_by_user():
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    
    user_id = get_jwt_identity()
    products = Product.query.filter_by(seller_id=user_id).all()
    listings = []
    for p in products:
        listings.append({
            "id":           p.id,
            "sellerId":    p.seller_id,
            "sellerUsername": p.seller_username,
            "title":        p.title,
            "description":  p.description,
            "price":        p.price,
            "category":     p.category,
            "condition":    p.condition,
            "imageUrls":    p.image_urls or [],
            "isAvailable": p.is_available,
            "timestamp":    p.posted_at.isoformat() if p.posted_at else None
        })

    return jsonify({"listings": listings}), 200


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
    image_urls = data.get("image_urls") 
    category = data.get('category')   

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
        image_urls=image_urls,
        is_available=True,
        category = category
    )
    db.session.add(product)
    try:
        db.session.commit()

        #build a response dict by hand: 
        listing_data = {
            "id":           product.id,
            "sellerId":    product.seller_id,
            "sellerUsername": product.seller_username,
            "title":        product.title,
            "description":  product.description,
            "price":        product.price,
            "condition":    product.condition,
            "imageUrls":    product.image_urls,
            "isAvailable": product.is_available,
            "timestamp":    product.posted_at.isoformat(),
            "category":     product.category
        }
        return jsonify({"message": "Listing created", "listing": listing_data}), 201
    except Exception as err:
        db.session.rollback()
        return jsonify({"error": "Database error: " + str(err)}), 500

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
    product.image_urls = data.get("image_urls", product.image_urls)
    
    try:
        db.session.commit()
    except Exception as err:
        db.session.rollback()
        return jsonify({"error": "Database error: " + str(err)}), 500
    
    listing_data = {
        "id":           product.id,
        "sellerId":    product.seller_id,
        "sellerUsername": product.seller_username,
        "title":        product.title,
        "description":  product.description,
        "price":        product.price,
        "condition":    product.condition,
        "image_urls":    product.image_urls,
        "isAvailable": product.is_available,
        "timestamp":    product.posted_at.isoformat(),
        "category":     product.category
    }

    return jsonify({"message": "Listing updated", "listing": listing_data}), 200

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
    ordered_at = data.get("ordered_at")
    if not product_id:
        return jsonify({"error": "Product ID is required"}), 400

    product = Product.query.get(product_id)
    if not product:
        return jsonify({"error": "Listing not found"}), 404

    order = Order(
        buyer_id=buyer_id,
        product_id=product_id,
        ordered_at=ordered_at,
        status="Pending"
    )
    db.session.add(order)
    try:
        db.session.commit()
    except Exception as err:
        db.session.rollback()
        return jsonify({"error": "Database error: " + str(err)}), 500
    
    order_data = {
        "buyerId": buyer_id,
        "productId": product_id,
        "timestamp": ordered_at.isoformat(),
        "status": "Pending"
    }

    return jsonify({"message": "Order created", "order": order_data}), 201

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
    
    order_data = {
        "buyerId": order.buyer_id,
        "productId": order.product_id,
        "timestamp": order.ordered_at.isoformat(),
        "status": order.status
    }

    return jsonify({"order": order_data}), 200

# Retrieve order details for specific user
@market_ops.route('/orders/user/', methods=['GET', 'OPTIONS'])
@jwt_required()
def get_order_by_user():
    user_id = get_jwt_identity()
    orders = Order.query.filter_by(buyer_id=user_id).all()

    order_data = []

    for order in orders:
        order_data.append({
            "buyerId": order.buyer_id,
            "productId": order.product_id,
            "timestamp": order.ordered_at.isoformat(),
            "status": order.status
        })

    return jsonify({"order": order_data}), 200

@market_ops.route("/users/profile", methods=["GET"])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()  # gets the user ID from the JWT
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    user_data = {
        "username": user.username,
        "password_hash": user.password_hash,
        "timestamp": user.created_at.isoformat()
    }
    return jsonify({"user": user_data}), 200

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
    
    user_data = {
        "username": user.username,
        "password_hash": user.password_hash,
        "created_at": user.created_at
    }
    return jsonify({"message": "User updated successfully", "user": user_data}), 200

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


# retrieve products by a specific user
@market_ops.route('/notifications/user', methods=['GET', 'OPTIONS'])
@jwt_required()
def get_notifications_by_user():
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    
    user_id = get_jwt_identity()
    notifications = Notification.query.filter_by(user_id=user_id).all()
    notifs = []
    for n in notifications:
        notifs.append({
            "id":           n.id,
            "userId":      n.user_id,
            "type":         n.type,
            "title":        n.title,
            "message":      n.message,
            "timestamp":  n.received_at.isoformat() if n.received_at else None,
            "read":         n.read,
            "actionUrl":   n.action_url,
            "senderId":    n.sender_id,
            "productId":   n.product_id,
            "imageUrls":    n.image_urls
        })

    return jsonify({"notifications": notifs}), 200


# retrieve products by a specific user
@market_ops.route('/notifications/num', methods=['GET', 'OPTIONS'])
@jwt_required()
def get_num_notifications():
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    
    user_id = get_jwt_identity()
    notifications = Notification.query.filter_by(user_id=user_id).all()

    return jsonify({"num": len(notifications)}), 200


# GET retrieved listings from VectorDB query
@market_ops.route("/search", methods=["GET"])
@jwt_required()
def vector_search(query):

    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)

    return jsonify({
        "user": {
            "id": user.id,
            "username": user.username,
            
            "createdAt": user.created_at.isoformat(),
            "stripeAccountId": user.stripe_account_id
        }
    })

@market_ops.route("/current_user", methods = ['GET'])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()

    user = User.query.get_or_404(user_id)

    return jsonify({
        "user": {
            "id": user.id,
            "username": user.username,
            
            "createdAt": user.created_at.isoformat(),
            "stripeAccountId": user.stripe_account_id
        }
    })