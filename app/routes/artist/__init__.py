from flask import Blueprint, render_template

from app.decorators import login_required
from app.routes.artist.music import artist_music_bp
from app.routes.artist.profile import artist_profile_bp
from app.models.enum.account_role import AccountRole

artist_bp = Blueprint('artist', __name__)
artist_bp.register_blueprint(artist_music_bp, url_prefix='/music')
artist_bp.register_blueprint(artist_profile_bp, url_prefix='/profile')


@artist_bp.route('/index')
@login_required(role=AccountRole.ARTIST)
def index():
    return render_template('artist/index.html')
