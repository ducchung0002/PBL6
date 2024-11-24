from bson import ObjectId
from flask import Blueprint, render_template, session

from app.decorators import login_required
from app.models import User
from app.models.video import Video
from app.models.enum.account_role import AccountRole

user_video_bp = Blueprint('video', __name__)

@user_video_bp.route('/list/<string:user_id>', methods=['GET'])
def list(user_id):
    user = User.objects.get(id=ObjectId(user_id))
    videos = Video.objects.get_videos_by_user(user_id)
    return render_template('user/video/video-list.html', user=user, videos=videos)

@user_video_bp.route('/add', methods=['GET'])
@login_required(role=AccountRole.USER)
def add():
    return render_template('user/video/video-record.html')