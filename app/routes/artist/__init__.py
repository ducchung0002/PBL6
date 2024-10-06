from flask import Blueprint

artist_bp = Blueprint('artist', __name__)

from .music import artist_music_bp
artist_bp.register_blueprint(admin_music_bp, url_prefix='/music')
