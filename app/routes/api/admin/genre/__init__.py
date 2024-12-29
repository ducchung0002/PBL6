from flask import Blueprint, jsonify, request
from flask_cors import cross_origin

from app.models.genre import Genre

api_admin_genre_bp = Blueprint('api_admin_genre', __name__)


@api_admin_genre_bp.route('/update', methods=['PUT'])
def update():
    data = request.get_json()
    Genre.objects.get(id=data['id']).update(set__name=data['name'], set__description=data['description'])
    return jsonify({'message': 'Genre edited successfully'}), 200


@api_admin_genre_bp.route('/delete', methods=['DELETE'])
def delete():
    data = request.get_json()
    Genre.objects.get(id=data['id']).delete()
    return jsonify({'message': 'Genre deleted successfully'}), 200


@api_admin_genre_bp.route('/add', methods=['POST'])
def add():
    data = request.get_json()
    genre = Genre(name=data['name'], description=data['description']).save()
    return jsonify({'id': str(genre.id), 'message': 'Genre added successfully'}), 201
