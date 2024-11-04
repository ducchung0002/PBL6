from flask import Blueprint, redirect, session, request
from bson import ObjectId
from app.models.video import Video  # Import model Video

top_trending_download_bp = Blueprint('top_trending_download_bp', __name__)


def get_video_url_from_db(video_id):
    # Truy vấn video trong DB
    video = Video.objects(id=ObjectId(video_id)).first()
    if not video:
        return None
    return video.video_url


@top_trending_download_bp.route('/download', methods=['GET'])
def download():
    video_id = request.args.get('video_id')
    if not video_id:
        return "Video ID is required", 400

    if 'user' not in session:
        return "Not authorized", 401

    video_url = get_video_url_from_db(video_id)
    if not video_url:
        return "Video not found", 404

    # Chèn chế độ fl_attachment nếu cần, tương tự ví dụ trước
    if "/upload/" in video_url:
        parts = video_url.split("/upload/")
        video_url = parts[0] + "/upload/fl_attachment/" + parts[1]

    return redirect(video_url)
