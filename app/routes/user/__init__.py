from flask import Blueprint, jsonify, render_template
from flask_jwt_extended import get_jwt_identity

from app.decorators import login_required
from app.models.user import User
from .video import user_video_bp
from ...models.enum.account_role import AccountRole

user_bp = Blueprint('user', __name__)
user_bp.register_blueprint(user_video_bp, url_prefix='/video')

@user_bp.route('/profile', methods=['GET'])
@login_required
def get_profile():
    current_user_id = get_jwt_identity()
    user = User.objects(id=current_user_id).first()
    if user:
        return jsonify({
            "username": user.username,
            "email": user.email
        }), 200
    return jsonify({"message": "User not found"}), 404


@user_bp.route('/index')
@login_required(role=AccountRole.USER)
def index():
    return render_template('user/index.html')
