from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, Product, CartItem

cart_bp = Blueprint('cart', __name__)

@cart_bp.route('/cart', methods=['GET'])
@jwt_required()
def get_cart():
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
    user_id = get_jwt_identity()
    data = request.get_json()
    
    product_id = data.get('product_id')
    quantity = data.get('quantity', 1)
    
    # Check if product exists
    product = Product.query.get(product_id)
    if not product or not product.is_available:
        return jsonify({'error': 'Product not available'}), 400
    
    # Check if product is already in cart
    cart_item = CartItem.query.filter_by(user_id=user_id, product_id=product_id).first()
    
    if cart_item:
        # Update quantity if already in cart
        cart_item.quantity += quantity
    else:
        # Add new item to cart
        cart_item = CartItem(user_id=user_id, product_id=product_id, quantity=quantity)
        db.session.add(cart_item)
    
    db.session.commit()
    return jsonify({'message': 'Item added to cart successfully'})

@cart_bp.route('/cart/update/<int:item_id>', methods=['PUT'])
@jwt_required()
def update_cart_item(item_id):
    user_id = get_jwt_identity()
    data = request.get_json()
    
    quantity = data.get('quantity')
    
    # Find the cart item
    cart_item = CartItem.query.filter_by(id=item_id, user_id=user_id).first()
    
    if not cart_item:
        return jsonify({'error': 'Cart item not found'}), 404
    
    if quantity <= 0:
        # Remove item if quantity is zero or negative
        db.session.delete(cart_item)
    else:
        # Update quantity
        cart_item.quantity = quantity
    
    db.session.commit()
    return jsonify({'message': 'Cart updated successfully'})

@cart_bp.route('/cart/remove/<int:item_id>', methods=['DELETE'])
@jwt_required()
def remove_from_cart(item_id):
    user_id = get_jwt_identity()
    
    # Find and remove the cart item
    cart_item = CartItem.query.filter_by(id=item_id, user_id=user_id).first()
    
    if not cart_item:
        return jsonify({'error': 'Cart item not found'}), 404
    
    db.session.delete(cart_item)
    db.session.commit()
    
    return jsonify({'message': 'Item removed from cart'})

@cart_bp.route('/cart/clear', methods=['DELETE'])
@jwt_required()
def clear_cart():
    user_id = get_jwt_identity()
    
    # Delete all cart items for the user
    CartItem.query.filter_by(user_id=user_id).delete()
    db.session.commit()
    
    return jsonify({'message': 'Cart cleared successfully'})