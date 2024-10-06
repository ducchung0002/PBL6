from flask import Blueprint
from app.routes.api.admin import api_admin_bp
from app.routes.api.video import video_bp

api_bp = Blueprint('api', __name__)
api_bp.register_blueprint(api_admin_bp, url_prefix='/admin')
api_bp.register_blueprint(video_bp, url_prefix='/video')