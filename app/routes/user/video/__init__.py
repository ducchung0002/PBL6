from flask import Blueprint, request

from app.models.video import Video
from decorators import login_required
from models.enum.account_role import AccountRole
from routes.api.auth.login import login

user_video_bp = Blueprint('video', __name__)

@user_video_bp.route('/list', methods=['GET'])
@login_required(role=AccountRole.USER)
def list():
    user_id = login.get_jwt_identity()
    videos = Video.objects(user_id=user_id)
    return videos.to_json()
