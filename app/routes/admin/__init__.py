from flask import Blueprint

admin_bp = Blueprint('admin', __name__)

from music import admin_music_bp
admin_bp.register_blueprint(admin_music_bp, url_prefix='/music')


from . import dashboard
