

from sentence_transformers import SentenceTransformer
from models import Product
from flask import Blueprint, request, jsonify, url_for
from flask_jwt_extended import get_jwt_identity, jwt_required
from sqlalchemy.orm import load_only


vector_bp = Blueprint("vectordb", __name__)

# high level overview: 
#first, we make vector embedWhat dings and store all prodouct title, description, category
#store these vectors using pgvector
#when a user searches, embed the query using pgvector
#use the vector db to retreive nearest neighbors to that query
#return the matched products back to the frontend

model = SentenceTransformer("all-MiniLM-L6-v2")
products = []


@vector_bp.route("/search", methods=['POST', 'OPTIONS'])
@jwt_required()
def search():
    # handle CORS preflight

    data = request.get_json() or {}
    question = data.get("query", "").strip()
    if not question:
        return jsonify({"error": "Query is required"}), 400

    # embed the query
    question_embedding = model.encode(question).tolist()

    # only load the columns we actually return
    results = (
        Product.query
               .options(
                   load_only(
                       Product.id,
                       Product.title,
                       Product.description,
                       Product.category,
                       Product.price,
                       Product.seller_username,
                       Product.is_available,
                       Product.posted_at
                   )
               )
               .order_by(Product.vector.cosine_distance(question_embedding))
               .limit(10)
               .all()
    )

    dict_json = []
    for r in results:
        dict_json.append({
            "id":             r.id,
            "title":          r.title,
            "description":    r.description,
            "category":       r.category,
            "price":          r.price,
            "imageUrl":       url_for(
                                   'market_operations.get_listing_image',
                                   listing_id=r.id,
                                   _external=True
                               ),
            "sellerUsername": r.seller_username
        })

    return jsonify({"results": dict_json}), 200