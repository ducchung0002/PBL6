from flask import Blueprint, jsonify, request

from app.models.artist import Artist

api_admin_artist_bp = Blueprint('api_admin_artist', __name__)

@api_admin_artist_bp.route('/add', methods=['POST'])
def add():
    data = request.get_json()
    artist = Artist(name=data['name'], username=data['username'], email=data['email'], date_of_birth=data['date_of_birth']).set_password(data['password']).save()
    return jsonify({'id': str(artist.id), 'message': 'Artist added successfully'}), 201


@api_admin_artist_bp.route('/update', methods=['PUT'])
def update():
    data = request.get_json()
    artist = Artist.objects.get(id=data['id'])
    if data.get('name'):
        artist.name = data['name']
    if data.get('username'):
        artist.username = data['username']
    if data.get('password'):
        artist.set_password(data['password'])
    if data.get('date_of_birth'):
        artist.date_of_birth = data['date_of_birth']
    artist.save()
    return jsonify({'message': 'Artist updated successfully'}), 200


@api_admin_artist_bp.route('/delete', methods=['DELETE'])
def delete():
    data = request.get_json()
    Artist.objects.get(id=data['id']).delete()
    return jsonify({'message': 'Artist deleted successfully'}), 200
