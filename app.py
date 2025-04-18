
from dotenv import load_dotenv
import os
from flask_sqlalchemy import SQLAlchemy
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from user_operations import market_ops
from models import db
from flask_migrate import Migrate
from stripe import stripe_bp
from auth import auth_bp
from cart import cart_bp

load_dotenv()

app = Flask(__name__)

CORS(app, supports_credentials=True)  # apply CORS globally

database_uri = os.getenv('DATABASE_URI')
app.config['SQLALCHEMY_DATABASE_URI'] = database_uri
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv("SECRET_KEY")


db.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = 3600

app.register_blueprint(stripe_bp, url_prefix = "/stripe")
app.register_blueprint(market_ops)
app.register_blueprint(auth_bp)
app.register_blueprint(cart_bp)

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))


