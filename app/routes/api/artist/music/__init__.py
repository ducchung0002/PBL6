import json
from flask import Blueprint, jsonify, request

api_artist_music_bp = Blueprint('api_artist_music', __name__)


@api_artist_music_bp.post('/add')
def add_music():
    from app.celery.tasks import upload_music_task

    lyrics = json.loads(request.files['lyrics'].read())
    name = request.form.get('name')
    artists = json.loads(request.files['artists'].read())
    genres = json.loads(request.files['genres'].read())

    audio_file = request.files.get('audio')
    karaoke_file = request.files.get('karaoke')
    thumbnail_file = request.files.get('thumbnail')

    # Read raw binary to pass to Celery
    audio_data = audio_file.read() if audio_file else None
    karaoke_data = karaoke_file.read() if karaoke_file else None
    thumbnail_data = thumbnail_file.read() if thumbnail_file else None

    # Enqueue the task
    task = upload_music_task.delay(lyrics, name, artists, genres,
                                   audio_data, karaoke_data, thumbnail_data)

    # Return the task ID to client
    return jsonify({"task_id": task.id}), 202
