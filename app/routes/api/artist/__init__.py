from flask import Blueprint
from app.routes.api.artist.profile import api_artist_profile_bp
from app.routes.api.artist.music import api_artist_music_bp

api_artist_bp = Blueprint('api_artist', __name__)
api_artist_bp.register_blueprint(api_artist_profile_bp, url_prefix='/profile')
api_artist_bp.register_blueprint(api_artist_music_bp, url_prefix='/music')

