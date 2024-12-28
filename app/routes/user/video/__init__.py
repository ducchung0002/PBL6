from bson import ObjectId
from flask import Blueprint, render_template, session, redirect, url_for

from app.decorators import login_required
from app.models.video import Video
import logging
from app.models.base.extended_account import ExtendedAccount

user_video_bp = Blueprint('video', __name__)

@user_video_bp.route('/list/<string:user_id>', methods=['GET'])
@login_required()
def list(user_id):
    user = ExtendedAccount.objects(id=user_id).first()
    videos = Video.objects.get_videos_by_user(user_id)
    return render_template('user/video/video-list.html', user=user, videos=videos)

@user_video_bp.route('/add', methods=['GET'])
@login_required()
def add():
    return render_template('user/video/video-record.html')

@user_video_bp.route('/<video_id>', methods=['GET'], endpoint='detail')
@login_required()
def detail(video_id):
    logging.debug(f"Truy cập chi tiết video với ID: {video_id}")
    user_session = session.get('user')
    if not user_session:
        logging.debug("Không tìm thấy user trong session, redirect đến login")
        return redirect(url_for('auth.login'))

    try:
        # Chuyển đổi video_id thành ObjectId
        video_obj_id = ObjectId(video_id)
    except Exception as e:
        logging.error(f"video_id không hợp lệ: {video_id}")
        return "Video không hợp lệ", 400

    video = Video.objects(id=video_obj_id).first()
    if not video:
        logging.debug(f"Không tìm thấy video với ID: {video_obj_id}")
        return "Video không tìm thấy", 404

    uploader = video.user.fetch()

    user = ExtendedAccount.objects(id=user_session['id']).first()
    if not user:
        logging.error("Không tìm thấy người dùng trong cơ sở dữ liệu.")
        return "User không hợp lệ", 400

    return render_template('user/video/detail.html', video=video, uploader=uploader)
