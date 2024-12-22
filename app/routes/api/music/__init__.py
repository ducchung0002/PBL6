from bson import ObjectId
from flask import Blueprint, request
from app.models.music import Music

api_music_bp = Blueprint('api_music', __name__)

@api_music_bp.route('/detail', methods=['POST'])
def get_music():
    data = request.get_json()
    music_id = data.get('music_id')
    music = Music.objects.get(id=ObjectId(music_id))
    return music.jsonify()