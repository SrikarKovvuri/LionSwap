from flask import Blueprint, request, jsonify, current_app
from flask_cors import cross_origin
from werkzeug.security import check_password_hash, generate_password_hash
from flask_jwt_extended import create_access_token
from models import User, db
import random, traceback, os, base64, requests
from email.mime.text import MIMEText
from dotenv import load_dotenv

# Google API imports
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from google.auth.transport.requests import Request

load_dotenv()

# Load from environment
CLIENT_ID = os.getenv("GMAIL_CLIENT_ID")
CLIENT_SECRET = os.getenv("GMAIL_CLIENT_SECRET")
REFRESH_TOKEN = os.getenv("GMAIL_REFRESH_TOKEN")
USER_EMAIL = os.getenv("GMAIL_USER")

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/login', methods=['POST'])
@cross_origin(origin=["https://lion-swap.com", "https://www.lion-swap.com"],
              supports_credentials=True)
def login():
    try:
        username = request.json.get("username")
        password = request.json.get("password")
        if not username or not password:
            return jsonify({"error": "Username and Password are required"}), 400

        user = User.query.filter_by(username=username).first()
        if not user or not check_password_hash(user.password_hash, password):
            return jsonify({"error": "Invalid username or password"}), 401

        token = create_access_token(identity=str(user.id))
        return jsonify({"message": "Login Successful", "token": token}), 201

    except Exception as e:
        current_app.logger.exception("💥 login crashed")
        resp = jsonify({"error": str(e)})
        resp.headers["Access-Control-Allow-Origin"] = "https://www.lion-swap.com"
        resp.headers["Access-Control-Allow-Credentials"] = "true"
        return resp, 500


@auth_bp.route('/confirm_credentials', methods=['POST'])
def confirm_credentials():
    try:
        username = request.json.get("username")
        email = request.json.get("email")
        password = request.json.get("password")
        phone = request.json.get("phone")

        if not email.endswith("@columbia.edu") and not email.endswith("@barnard.edu"):
            return jsonify({"error": "Email must be @columbia.edu or @barnard.edu"}), 401

        if not username or not password or not email:
            return jsonify({"error": "Username, Email, and Password are required"}), 402

        if User.query.filter_by(username=username).first():
            return jsonify({"error": "Username is already taken"}), 403
        if User.query.filter_by(email=email).first():
            return jsonify({"error": "Email is already taken"}), 404
        if User.query.filter_by(phone=phone).first():
            return jsonify({"error": "Phone number is already taken"}), 405

        passcode = random.randint(100000, 999999)
        disclaimer = (
            "LionSwap will never email you and ask you to disclose or verify your password, "
            "credit card, or banking account number. If you receive a suspicious email with a link to "
            "update your account information, do not click on the link. Instead, report the e-mail "
            "to LionSwap for investigation."
        )
        send_email(email, "LionSwap Account Verification", f"Here is your passcode: {passcode}\n\n{disclaimer}")

        return jsonify({"message": "Confirmed Credentials", "passcode": passcode}), 201

    except Exception:
        tb = traceback.format_exc()
        current_app.logger.error(f"🛑 signup error:\n{tb}")
        return jsonify({"error": "Internal server error", "trace": tb}), 500


@auth_bp.route('/signup', methods=['POST'])
def signup():
    username = request.json.get("username")
    email = request.json.get("email")
    password = request.json.get("password")
    phone = request.json.get("phone")

    hashed_password = generate_password_hash(password)
    user = User(username=username, email=email, phone=phone, password_hash=hashed_password)
    db.session.add(user)
    db.session.commit()

    token = create_access_token(identity=str(user.id))
    return jsonify({"message": "Signup Successful", "token": token}), 201


# ------------ GMAIL API ----------------
creds = Credentials(
    token=None,
    refresh_token=REFRESH_TOKEN,
    token_uri='https://oauth2.googleapis.com/token',
    client_id=CLIENT_ID,
    client_secret=CLIENT_SECRET
)
# Force initial token fetch
creds.refresh(Request())
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
    # Refresh token if expired before each send
    if not creds.valid or creds.expired:
        creds.refresh(Request())
    message = create_message(USER_EMAIL, to, subject, body)
    sent_message = service.users().messages().send(userId="me", body=message).execute()
    print(f"Message sent! ID: {sent_message['id']}")


def get_access_token():
    response = requests.post(
        'https://oauth2.googleapis.com/token',
        data={
            'client_id': CLIENT_ID,
            'client_secret': CLIENT_SECRET,
            'refresh_token': REFRESH_TOKEN,
            'grant_type': 'refresh_token',
        }
    )
    if response.ok:
        return response.json()['access_token']
    else:
        raise Exception(f"Failed to refresh token: {response.text}")
