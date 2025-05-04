from dotenv import load_dotenv
# load environment variables
load_dotenv(override = True)
import os
from flask_sqlalchemy import SQLAlchemy
from flask import Flask
from flask_cors import CORS




# initialize Flask app
app = Flask(__name__)

# enable CORS,v replace this with localhost for testing
CORS(
    app,
    supports_credentials=True,
    resources={r"/*": {
      "origins": [
        "https://lion-swap.com",
        "https://www.lion-swap.com",
        "http://localhost:3000"
      ]
    }},
    methods=["GET","POST","PUT","DELETE","OPTIONS"],
    allow_headers=["Content-Type","Authorization", "X-Requested-With"]
)
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from sqlalchemy import event
from sqlalchemy.engine import Engine
import stripe
from pgvector.psycopg2 import register_vector  # register pgvector adapter
from models import db

from auth import auth_bp
from cart import cart_bp
from user_operations import market_ops
from vectordb import vector_bp
# configure database
database_uri = os.getenv('DATABASE_URI')
app.config['SQLALCHEMY_DATABASE_URI'] = database_uri
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# configure JWT
app.config['JWT_SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = 3600

# initialize extensions
db.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)

# register pgvector adapter so psycopg2 knows how to send VECTOR types
@event.listens_for(Engine, 'connect')
def _register_vector(dbapi_connection, connection_record):
    register_vector(dbapi_connection)

from stripe_routes import stripe_bp
# register blueprints
app.register_blueprint(stripe_bp)
app.register_blueprint(market_ops)
app.register_blueprint(auth_bp)
app.register_blueprint(cart_bp)
app.register_blueprint(vector_bp)
# entry point
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))