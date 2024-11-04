from flask import Blueprint
from app.routes.api.user.video import api_user_video_bp

api_user_bp = Blueprint('api_user', __name__)
api_user_bp.register_blueprint(api_user_video_bp, url_prefix='/video')
