from flask import Blueprint

admin_bp = Blueprint('admin', __name__)

from .music import admin_music_bp
admin_bp.register_blueprint(admin_music_bp, url_prefix='/music')

from .artist import admin_artist_bp
admin_bp.register_blueprint(admin_artist_bp, url_prefix='/artist')
from . import dashboard

from .genre import admin_genre_bp
admin_bp.register_blueprint(admin_genre_bp, url_prefix='/genre')
from . import dashboard
