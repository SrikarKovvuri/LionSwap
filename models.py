from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = "user"
    id           = db.Column(db.Integer, primary_key=True)
    username     = db.Column(db.String(80),  unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    created_at   = db.Column(db.DateTime, default=datetime.utcnow)

    products  = db.relationship("Product", backref="seller", lazy=True)
    reviews   = db.relationship("Review",  backref="author", lazy=True)

    cart_items = db.relationship(
        "CartItem",
        back_populates="user",
        cascade="all, delete-orphan",
        lazy=True
    )

class Product(db.Model):
    __tablename__ = "product"
    id          = db.Column(db.Integer, primary_key=True)
    title       = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    price       = db.Column(db.Float, nullable=False)
    condition   = db.Column(db.String(50), nullable=False)
    image_url   = db.Column(db.String(250))
    posted_at   = db.Column(db.DateTime, default=datetime.utcnow)
    is_available = db.Column(db.Boolean, default=True)

    seller_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    seller_username = db.Column(db.String(100), nullable = True)

    reviews = db.relationship("Review", backref="product", lazy=True)
    orders  = db.relationship("Order",  backref="product", lazy=True)

class Review(db.Model):
    __tablename__ = "review"
    id        = db.Column(db.Integer, primary_key=True)
    content   = db.Column(db.Text, nullable=False)
    rating    = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    product_id = db.Column(db.Integer, db.ForeignKey("product.id"), nullable=False)
    author_id  = db.Column(db.Integer, db.ForeignKey("user.id"),    nullable=False)

class Order(db.Model):
    __tablename__ = "order"
    id         = db.Column(db.Integer, primary_key=True)
    buyer_id   = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey("product.id"), nullable=False)
    ordered_at = db.Column(db.DateTime, default=datetime.utcnow)
    status     = db.Column(db.String(50), default="Pending")

    buyer = db.relationship("User", backref="orders", foreign_keys=[buyer_id])

class CartItem(db.Model):
    __tablename__ = "cart_item"
    id        = db.Column(db.Integer, primary_key=True)
    title     = db.Column(db.String(100), nullable=False)
    user_id   = db.Column(db.Integer, db.ForeignKey("user.id"),    nullable=False)
    product_id= db.Column(db.Integer, db.ForeignKey("product.id"), nullable=False)
    price     = db.Column(db.Float, nullable=False)
    image     = db.Column(db.String(200))
    added_at  = db.Column(db.DateTime, default=datetime.utcnow)

    user    = db.relationship("User",    back_populates="cart_items")
    product = db.relationship("Product")

    @property
    def subtotal(self):
        return self.quantity * self.price  if hasattr(self, "quantity") else self.price