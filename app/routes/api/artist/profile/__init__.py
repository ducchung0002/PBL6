from bson import ObjectId
from flask import Blueprint, jsonify, request, session
import cloudinary
import cloudinary.uploader
from app.models.artist import Artist

api_artist_profile_bp = Blueprint('api_artist_profile', __name__)
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@api_artist_profile_bp.route('/update', methods=['PUT'])
def update():
    data = request.form
    file = request.files.get('image')
    artist_id = data['id']
    artist = Artist.objects.get(id=ObjectId(artist_id))
    if data.get('name'):
        artist.name = data['name']
    if data.get('nickname'):
        artist.nickname = data['nickname']
    if data.get('date_of_birth'):
        artist.date_of_birth = data['date_of_birth']
    if data.get('bio'):
        artist.bio = data['bio']
    new_artist = {
        "id": str(artist.id),
        "name": artist.name,
        "username": artist.username,
        "email": artist.email,
        "date_of_birth": str(artist.date_of_birth),
        "bio": artist.bio,
        "role": session['user']['role'],
        "avatar_url": artist.avatar_url,
        "nickname": artist.nickname
    }
    session['user'] = new_artist
    if file:
        public_id = f"user_{str(artist.id)}_avatar"
        try:
            response = cloudinary.uploader.upload(
                file,
                resource_type="image",
                public_id=public_id,
                overwrite=True,
                transformation=[
                    {
                        'width': 212,
                        'height': 212,
                        'crop': 'fill',
                        'gravity': 'face',
                        'quality': 'auto',
                        'fetch_format': 'auto'
                    }
                ]
            )
            avatar_url = response['secure_url']
            artist.avatar_url = avatar_url
            artist.save()
            new_artist = {
                "id": str(artist.id),
                "name": artist.name,
                "username": artist.username,
                "email": artist.email,
                "date_of_birth": str(artist.date_of_birth),
                "bio": artist.bio,
                "role": session['user']['role'],
                "avatar_url": artist.avatar_url,
                "nickname": artist.nickname
            }
            session['user'] = new_artist
        except Exception as e:
            print(f"Cloudinary upload error: {e}")
    artist.save()
    return jsonify({'message': 'Artist profile updated successfully', "artist": new_artist}), 200
