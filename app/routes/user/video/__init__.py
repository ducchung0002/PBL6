from flask import Blueprint, render_template, session

from decorators import login_required
from models.base.extended_account import ExtendedAccount
from models.enum.account_role import AccountRole

user_video_bp = Blueprint('video', __name__)

@user_video_bp.route('/list', methods=['GET'])
@login_required(role=AccountRole.USER)
def list():
    user_id = session['user'].get('id')
    videos = ExtendedAccount.objects.get_videos(user_id)
    return render_template('user/video/video-list.html', videos=videos)

@user_video_bp.route('/add', methods=['GET'])
@login_required(role=AccountRole.USER)
def add():
    return render_template('user/video/video-record.html')