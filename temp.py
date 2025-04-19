from models import Product, db
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")

def backfill_product_vectors():
    products = Product.query.all()
    for product in products:
        text = f"{product.title} {product.description or ''} {product.category or ''}"
        embedding = model.encode(text).tolist()
        product.vector = embedding
    db.session.commit()
