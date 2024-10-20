from app.models.video import Video
from flask import Blueprint, jsonify, request, session
from werkzeug.utils import secure_filename
import os
import cloudinary
import cloudinary.uploader

from app.models.music import Music

api_user_video_bp = Blueprint('api_user_video', __name__)
ALLOWED_EXTENSIONS = {'mp4', 'avi', 'mov', 'webm'}


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@api_user_video_bp.route('/record', methods=['POST'])
def record_video():
    user_id = session.get('user').get('id')
    # Check if the request contains the file part
    if 'video' not in request.files:
        return jsonify({'error': 'No video file provided'}), 400

    video_file = request.files['video']

    # Ensure the file has an allowed extension
    if video_file and allowed_file(video_file.filename):
        filename = secure_filename(video_file.filename)

        # Get title and description from the form
        title = request.form.get('title')
        if not title:
            return jsonify({'error': 'Title and description are required'}), 400

        try:
            # Upload video to Cloudinary (adjust according to your Cloudinary setup)


            # Save video details in the database
            music = Music.objects(name="Song 1").first()
            video = Video(user=user_id, music=music.id, title=title).save()

            response = cloudinary.uploader.upload(video_file, resource_type="video", format="mp4")
            video_url = response['url']
            video.update(set__video_url=video_url)

            return jsonify({
                'id': str(video.id),
                'message': 'Video recorded and uploaded successfully',
                'url': video_url
            }), 201
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    else:
        return jsonify({'error': 'Invalid file type or file missing'}), 400
