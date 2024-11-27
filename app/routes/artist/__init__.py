from flask import Blueprint, render_template

from app.decorators import login_required
from app.routes.artist.music import artist_music_bp
from app.routes.artist.profile import artist_profile_bp
from app.models.enum.account_role import AccountRole

artist_bp = Blueprint('artist', __name__)
artist_bp.register_blueprint(artist_music_bp)
artist_bp.register_blueprint(artist_profile_bp)

# @user_bp.route('/profile', methods=['GET'])
# @login_required
# def get_profile():
#     current_user_id = get_jwt_identity()
#     user = User.objects(id=current_user_id).first()
#     if user:
#         return jsonify({
#             "username": user.username,
#             "email": user.email
#         }), 200
#     return jsonify({"message": "User not found"}), 404


@artist_bp.route('/index')
@login_required(role=AccountRole.ARTIST)
def index():
    return render_template('artist/index.html')
