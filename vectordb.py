

from sentence_transformers import SentenceTransformer
from models import Product
from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required

vector_bp = Blueprint("vectordb", __name__)

# high level overview: 
#first, we make vector embedWhat dings and store all prodouct title, description, category
#store these vectors using pgvector
#when a user searches, embed the query using pgvector
#use the vector db to retreive nearest neighbors to that query
#return the matched products back to the frontend

model = SentenceTransformer("all-MiniLM-L6-v2")
products = []


@vector_bp.route("/search", methods = ['POST'])
@jwt_required()
def search():
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    
    data = request.get_json()
    question = data.get("query", "").strip()
    if not question: 
        return jsonify({"error": "Query is required"}), 400
    
    question_embedding = model.encode(question).tolist()

    results = (
        Product.query 
                .order_by (
                    Product.vector.cosine_distance(question_embedding)
                )
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
            "imageUrl":       r.image_url,   
            "sellerUsername": r.seller_username
        })

    return jsonify({"results": dict_json}), 200





