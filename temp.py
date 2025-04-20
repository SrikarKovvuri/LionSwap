# backfill_vectors.py

from app import app
from models import db, Product
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")

def backfill_product_vectors():
    products = Product.query.all()
    print(f"↳ Found {len(products)} products, computing embeddings…")
    for p in products:
        text = f"{p.title} {p.description or ''} {p.category or ''}"
        # .tolist() → a plain Python list, what pgvector wants
        p.vector = model.encode(text).tolist()
    db.session.commit()
    print(" All product vectors backfilled.")

if __name__ == "__main__":
    # must push an application context so SQLAlchemy knows which app to use
    with app.app_context():
        backfill_product_vectors()
