import re

from flask import Blueprint, jsonify, request

from app.models.base.account import Account
from models.base.extended_account import ExtendedAccount

api_auth_login_bp = Blueprint('api_auth_login', __name__)


@api_auth_login_bp.route('/validate', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if re.match(pattern, username):
        user = ExtendedAccount.objects(email=username).first()
    else:
        user = Account.objects(username=username).first()

    if user:
        if user.check_password(password):
            return jsonify({'success': True})
        else:
            return jsonify({'success': False, 'error': 'wrong password'})

    return jsonify({'success': False, 'error': 'not found'})
