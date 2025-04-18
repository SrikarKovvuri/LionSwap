from flask import Blueprint, request, jsonify
from models import User, db
from werkzeug.security import check_password_hash, generate_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS

auth_bp = Blueprint('auth', __name__)
CORS(auth_bp, supports_credentials=True) 
@auth_bp.route('/login', methods = ['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    
    username = request.json.get("username")
    password = request.json.get("password")

    if not username or not password:
        return jsonify({"error": "Username and Password are required"}), 400
    
    user = User.query.filter_by(username = username).first()

    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"error": "Invalid username or password"})
    
    token = create_access_token(identity=str(user.id))

    return jsonify({
        "message": "Login Successful",
        "token": token
    }), 201

@auth_bp.route('/signup', methods = ['POST', 'OPTIONS'])
def signup():
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    
    username = request.json.get("username")
    password = request.json.get("password")

    if not username or not password:
        return jsonify({"error": "Username and Password are required"})
    
    if User.query.filter_by(username = username).first():
        return jsonify({"error": "Username is already taken"})
    
    hashed_password = generate_password_hash(password)
    user = User(username=username, password_hash=hashed_password)
    
    db.session.add(user)
    db.session.commit()

    token = create_access_token(identity=str(user.id))
    
    return jsonify({
        "message": "Signup Successful",
        "token": token
    }), 201

