from flask import Blueprint
from app.routes.api.admin.artist import api_admin_artist_bp
from app.routes.api.admin.genre import api_admin_genre_bp

api_admin_bp = Blueprint('api_admin', __name__)
api_admin_bp.register_blueprint(api_admin_genre_bp, url_prefix='/genre')
api_admin_bp.register_blueprint(api_admin_artist_bp, url_prefix='/artist')
