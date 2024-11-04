from flask import Blueprint, render_template

from app.decorators import login_required
from models.enum.account_role import AccountRole

user_video_bp = Blueprint('video', __name__)

@user_video_bp.route('/list', methods=['GET'])
@login_required(role=AccountRole.USER)
def get_videos():
    return render_template('user/video/video-record.html')
