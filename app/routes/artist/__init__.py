from flask import Blueprint, render_template

from app.decorators import login_required
from .music import artist_music_bp
from .profile import artist_profile_bp
from ...models.enum.account_role import AccountRole

artist_bp = Blueprint('artist', __name__)
artist_bp.register_blueprint(artist_music_bp)
artist_bp.register_blueprint(artist_profile_bp)

@artist_bp.route('/index')
@login_required(role=AccountRole.ARTIST)
def index():
    return render_template('artist/index.html')
