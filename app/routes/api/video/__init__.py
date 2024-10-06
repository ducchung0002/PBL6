from flask import Blueprint, jsonify

from app.models.video import Video

video_bp = Blueprint('video', __name__)


@video_bp.route('/get', methods=['GET'])
def get_video():
    videos = [video.jsonify() for video in Video.get_random_videos(5)]
    return jsonify(videos), 200
