from flask import Blueprint, render_template
from app.decorators import login_required
from models.enum.account_role import AccountRole
from .artist import admin_artist_bp
from .genre import admin_genre_bp
from .music import admin_music_bp

admin_bp = Blueprint('admin', __name__)
admin_bp.register_blueprint(admin_music_bp, url_prefix='/music')
admin_bp.register_blueprint(admin_artist_bp, url_prefix='/artist')
admin_bp.register_blueprint(admin_genre_bp, url_prefix='/genre')


@admin_bp.route('/index')
@login_required(role=AccountRole.ADMIN)
def index():
    return render_template('admin/index.html')
