from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
import boto3
import os
from dotenv import load_dotenv
aws_bp = Blueprint("aws_bp", __name__)

load_dotenv()

s3 = boto3.client(
        's3',
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    region_name="us-east-1"
)

def upload_image_to_s3(file_obj, filename, content_type):
    bucket = "lionswap-images"
    s3.upload_fileobj(
        file_obj,
        bucket,
        filename,
        ExtraArgs={"ContentType": content_type, "ACL": "public-read"}  # makes the file publicly accessible
    )
    return f"https://{bucket}.s3.amazonaws.com/{filename}"

@aws_bp.route("/uploads", methods = ['POST'])
@jwt_required()
def upload_image():
    user_id = get_jwt_identity
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files[f'file']
    filename = secure_filename(file.fileame)

def upload_multiple_images_to_s3(files):
    bucket = os.getenv("AWS_BUCKET_NAME")
    uploaded_urls = []

    for file in files:
        filename = secure_filename(file.filename)
        s3.upload_fileobj(
            file,
            bucket,
            filename,
            ExtraArgs={"ContentType": file.content_type, "ACL": "public-read"},
        )
        url = f"https://{bucket}.s3.amazonaws.com/{filename}"
        uploaded_urls.append(url)

    return uploaded_urls


