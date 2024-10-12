from flask import Blueprint, jsonify, request

from utils import get_account_by_username

api_auth_login_bp = Blueprint('api_auth_login', __name__)


@api_auth_login_bp.route('/validate', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    account = get_account_by_username(username)

    if account:
        if account.check_password(password):
            return jsonify({'success': True})
        else:
            return jsonify({'success': False, 'error': 'wrong password'})

    return jsonify({'success': False, 'error': 'not found'})
