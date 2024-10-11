from flask import Blueprint, jsonify, request

from app.models.base.account import Account

api_auth_register_bp = Blueprint('api_auth_register', __name__)


@api_auth_register_bp.route('/validate', methods=['POST'])
def register():
    data = request.get_json()

    name = data.get('name')
    email = data.get('email')
    username = data.get('username')
    password = data.get('password')
    date_of_birth = data.get('date_of_birth')

    if Account.objects(email=email).first():
        return jsonify({'validate_error': 'AUTH_VALIDATE_EMAIL_EXISTS', 'success': False})
    if Account.objects(username=username).first():
        return jsonify({'validate_error': 'AUTH_VALIDATE_USERNAME_EXISTS', 'success': False})


    # user = User(name=name, username=username,email=email,  date_of_birth=date_of_birth).set_password(password).save()
    # user.save()

    return jsonify({'success': True})
