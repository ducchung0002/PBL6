from flask import Blueprint, jsonify, request

from app.models.base.account import Account
from models.user import User

api_auth_register_bp = Blueprint('api_auth_register', __name__)


@api_auth_register_bp.route('/create', methods=['POST'])
def register():
    data = request.get_json()

    name = data.get('name')
    email = data.get('email')
    username = data.get('username')
    password = data.get('password')
    date_of_birth = data.get('date_of_birth')

    if Account.objects(email=email).first():
        return jsonify({'error': 'email exists', 'success': False})
    if Account.objects(username=username).first():
        return jsonify({'error': 'username exists', 'success': False})

    user = User(name=name, username=username, email=email, date_of_birth=date_of_birth).set_password(password).save()
    user.save()

    return jsonify({'success': True})
