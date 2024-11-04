# PBL6/app/routes/user/have_seen_videos/download.py
from flask import Blueprint, redirect, session, request
from bson import ObjectId
from app.models.video import Video

user_have_seen_videos_download_bp = Blueprint('have_seen_videos_download', __name__)


def get_video_url_from_db(video_id):
    video = Video.objects(id=ObjectId(video_id)).first()
    if not video:
        return None
    return video.video_url


@user_have_seen_videos_download_bp.route('/download', methods=['GET'])
def download():
    video_id = request.args.get('video_id')
    if not video_id:
        return "Video ID is required", 400

    if 'user' not in session:
        return "Not authorized", 401

    video_url = get_video_url_from_db(video_id)
    if not video_url:
        return "Video not found", 404

    # Thêm fl_attachment vào URL để trình duyệt tải video thay vì phát trực tiếp
    if "/upload/" in video_url:
        parts = video_url.split("/upload/")
        video_url = parts[0] + "/upload/fl_attachment/" + parts[1]

    return redirect(video_url)
