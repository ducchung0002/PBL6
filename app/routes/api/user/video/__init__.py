from app.models.video import Video

from flask import Blueprint, jsonify, request


api_user_video_bp = Blueprint('api_user_video', __name__)

@api_user_video_bp.route('/record', methods=['POST'])
def record_video():
    data = request.get_json()
    video = Video(title=data['title'], description=data['description'], url=data['url']).save()
    return jsonify({'id': str(video.id), 'message': 'Video recorded successfully'}), 201