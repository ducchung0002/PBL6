from flask import Blueprint, render_template

from app.decorators import login_required
from ...models.enum.account_role import AccountRole

artist_bp = Blueprint('artist', __name__)


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
