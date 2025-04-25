from flask import Blueprint, request, jsonify
from models import User, db
from werkzeug.security import check_password_hash, generate_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
import random

import os
import base64
from email.mime.text import MIMEText
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from dotenv import load_dotenv

load_dotenv()

# Load from .env
CLIENT_ID = os.getenv("GMAIL_CLIENT_ID")
CLIENT_SECRET = os.getenv("GMAIL_CLIENT_SECRET")
REFRESH_TOKEN = os.getenv("GMAIL_REFRESH_TOKEN")
USER_EMAIL = os.getenv("GMAIL_USER")



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


@auth_bp.route('/confirm_credentials', methods = ['POST', 'OPTIONS'])
def confirm_credentials():
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    
    username = request.json.get("username")
    email = request.json.get("email")
    password = request.json.get("password")
    phone = request.json.get("phone")

    if email[len(email)-13:] != "@columbia.edu":  # check for @columbia.edu
        return jsonify({"error": "Email must be @columbia.edu"}), 401

    if not username or not password or not email:
        return jsonify({"error": "Username, Email, and Password are required"}), 402
    
    if User.query.filter_by(username = username).first():
        return jsonify({"error": "Username is already taken"}), 403
    
    if User.query.filter_by(email = email).first():
        return jsonify({"error": "Email is already taken"}), 404
    
    if User.query.filter_by(phone = phone).first():
        return jsonify({"error": "Phone number is already taken"}), 405
    
    passcode = random.randint(100000, 999999)

    disclaimer = "LionSwap will never email you and ask you to disclose or verify your password, credit card, or banking account number. If you receive a suspicious email with a link to update your account information, do not click on the link. Instead, report the e-mail to LionSwap for investigation."

    send_email(email, "LionSwap Account Verification", "Here is your passcode: " + str(passcode) + "\n\n" + disclaimer)
    
    return jsonify({
        "message": "Confirmed Credentials",
        "passcode": passcode
    }), 201



# ------------ GMAIL API ----------------
creds = Credentials(
    None,
    refresh_token=REFRESH_TOKEN,
    token_uri='https://oauth2.googleapis.com/token',
    client_id=CLIENT_ID,
    client_secret=CLIENT_SECRET
)

# Build Gmail API service
service = build('gmail', 'v1', credentials=creds)

def create_message(sender, to, subject, message_text):
    message = MIMEText(message_text)
    message['to'] = to
    message['from'] = sender
    message['subject'] = subject
    raw = base64.urlsafe_b64encode(message.as_bytes()).decode()
    return {'raw': raw}

def send_email(to, subject, body):
    message = create_message(USER_EMAIL, to, subject, body)
    sent_message = service.users().messages().send(userId="me", body=message).execute()
    print(f"Message sent! ID: {sent_message['id']}")



@auth_bp.route('/signup', methods = ['POST', 'OPTIONS'])
def signup():
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    
    username = request.json.get("username")
    email = request.json.get("email")
    password = request.json.get("password")
    phone = request.json.get("phone")
    
    hashed_password = generate_password_hash(password)
    user = User(username=username, email=email, phone=phone, password_hash=hashed_password)
    
    db.session.add(user)
    db.session.commit()

    token = create_access_token(identity=str(user.id))
    
    return jsonify({
        "message": "Signup Successful",
        "token": token
    }), 201

