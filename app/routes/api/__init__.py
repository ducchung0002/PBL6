from flask import Blueprint

from app.routes.api.video import video_bp

api_bp = Blueprint('api', __name__)
api_bp.register_blueprint(video_bp, url_prefix='/video')

