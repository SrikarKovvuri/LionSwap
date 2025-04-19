from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()
##IN THE FUTURE, FOR REAL DATA, WE NEED TO PUT BACK THE PRODUCT_ID FOR ALL THE MODELS!!!
# ───────────────────────────  USERS  ────────────────────────────
class User(db.Model):
    __tablename__ = "user"

    id            = db.Column(db.Integer, primary_key=True)
    username      = db.Column(db.String(80),  unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    created_at    = db.Column(db.DateTime, default=datetime.utcnow)

    # still keep normal relations that *do* use FKs
    products  = db.relationship("Product", backref="seller", lazy=True)
    reviews   = db.relationship("Review",  backref="author", lazy=True)

    # ► cart_items no longer tries to back‑populate Product
    cart_items = db.relationship(
        "CartItem",
        back_populates="user",
        cascade="all, delete-orphan",
        lazy=True,
    )

# ───────────────────────────  PRODUCTS  ─────────────────────────
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
    category = db.Column(db.String(30), nullable = False)

    seller_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    seller_username = db.Column(db.String(80),  unique=True, nullable=False)

    reviews = db.relationship("Review", backref="product", lazy=True)
    orders  = db.relationship("Order",  backref="product", lazy=True)

# ───────────────────────────  REVIEWS  ──────────────────────────
class Review(db.Model):
    __tablename__ = "review"

    id         = db.Column(db.Integer, primary_key=True)
    content    = db.Column(db.Text, nullable=False)
    rating     = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

#     product_id = db.Column(db.Integer, db.ForeignKey("product.id"), nullable=False)
#     author_id  = db.Column(db.Integer, db.ForeignKey("user.id"),    nullable=False)

# ───────────────────────────  ORDERS  ───────────────────────────
class Order(db.Model):
    __tablename__ = "order"

    id         = db.Column(db.Integer, primary_key=True)
    buyer_id   = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey("product.id"), nullable=False)
    ordered_at = db.Column(db.DateTime, default=datetime.utcnow)
    status     = db.Column(db.String(50), default="Pending")

    buyer = db.relationship("User", backref="orders", foreign_keys=[buyer_id])

# ───────────────────────────  NOTIFICATIONS  ───────────────────────
class Notification(db.Model):
    __tablename__ = "notification"

    id         = db.Column(db.Integer, primary_key=True)
    user_id    = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    type       = db.Column(db.String(50), nullable=False)
    title      = db.Column(db.String(100), nullable=False)
    message    = db.Column(db.Text)
    received_at= db.Column(db.DateTime, default=datetime.utcnow)
    read       = db.Column(db.Boolean, nullable=False)
    action_url = db.Column(db.String(250), nullable=True)
    sender_id  = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=True)
    product_id = db.Column(db.Integer, db.ForeignKey("product.id"), nullable=True)
    image_url  = db.Column(db.String(250), nullable=True)

    buyer = db.relationship("User", backref="notifications", foreign_keys=[user_id])

# ───────────────────────────  CART ITEMS  ───────────────────────
class CartItem(db.Model):
    __tablename__ = "cart_item"

    id        = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer)
    title     = db.Column(db.String(100), nullable=False)
    user_id   = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)

    # ──  NO product_id and NO relationship to Product any more  ──
    price     = db.Column(db.Float, nullable=False)
    image     = db.Column(db.String(200))
    added_at  = db.Column(db.DateTime, default=datetime.utcnow)

    # back‑link only to the owning user
    user = db.relationship("User", back_populates="cart_items")

    @property
    def subtotal(self) -> float:
        return self.price   # quantity handling removed for now
