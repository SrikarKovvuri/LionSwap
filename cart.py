from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, Product, CartItem
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime


cart_bp = Blueprint('cart', __name__)


@cart_bp.route('/cart', methods=['GET'])
@jwt_required()
def get_cart():
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    
    user_id = get_jwt_identity()
    cart_items = CartItem.query.filter_by(user_id=user_id).all()
    
    cart_data = []
    total = 0
    
    for item in cart_items:
        item_data = {
            'id': item.id,
            'product_id': item.product_id,
            'title': item.product.title,
            'price': item.product.price,
            'image_url': item.product.image_url,
            'quantity': item.quantity,
            'subtotal': item.subtotal
        }
        cart_data.append(item_data)
        total += item.subtotal
    
    return jsonify({
        'items': cart_data,
        'total': total,
        'item_count': len(cart_data)
    })



@cart_bp.route('/cart/add', methods=['POST'])
@jwt_required()
def add_to_cart():
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    
    user_id = int(get_jwt_identity())
    data = request.get_json()
    
    product_name = data.get('item_name')
    product_id = data.get('item_id')
    product_price = data.get('item_price')
    product_image = data.get('item_image')
    product_category = data.get('item_category')
    if not all([product_id, product_name, product_price, product_image, product_category]):
        return jsonify({'error': 'Missing required fields'}), 400

    
    # Check if product exists in our database 
    #product = Product.query.get(product_id) #       COME BACK TO THIS AFTER YOU MAKE LISTING POST REQUESTS WORK (adding new listings to the database)
    #if not product or not product.is_available:
     #   return jsonify({'error': 'Product not available'}), 400
    
    # Check if product is already in cart
    cart_item = CartItem.query.filter_by(user_id=user_id, product_id=product_id).first()
    
    if not cart_item:
        # if not already in cart, add new item to cart
        cart_item = CartItem(user_id=user_id, title=product_name, product_id=product_id, price=product_price, image=product_image, added_at=datetime.utcnow())
        db.session.add(cart_item)
    
    db.session.commit()
    return jsonify({'message': 'Item added to cart successfully'}), 200



@cart_bp.route('/remove', methods=['DELETE'])
@jwt_required()
def remove_from_cart(item_id):
    if request.method == 'OPTIONS':
        return jsonify({}), 200

    user_id = get_jwt_identity()
    
    cart_item = CartItem.query.filter_by(id=item_id, user_id=user_id).first()
    data = request.get_json() or {}
    item_id = data.get('item_id')
    if not item_id:
        return jsonify({"error": "item_id is required"}), 400
    cart_item = CartItem.query.filter_by(id=item_id, user_id=user_id).first()

    if not cart_item:
        return jsonify({'error': 'Cart item not found'}), 404
    
    db.session.delete(cart_item)
    db.session.commit()
    
    return jsonify({'message': 'Item removed from cart'}), 200



@cart_bp.route('/cart/clear', methods=['DELETE'])
@jwt_required()
def clear_cart():
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    
    user_id = get_jwt_identity()
    
    # Delete all cart items for the user
    CartItem.query.filter_by(user_id=user_id).delete()
    db.session.commit()
    
    return jsonify({'message': 'Cart cleared successfully'}), 200