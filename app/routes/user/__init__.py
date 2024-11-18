from flask import Blueprint, jsonify, render_template, session
from flask_jwt_extended import get_jwt_identity
from flask_wtf.csrf import generate_csrf

from app.decorators import login_required
from app.models.user import User
from .video import user_video_bp
from .profile import user_profile_bp
from ..forms.login_form import LoginForm
from ..forms.register_form import RegisterForm
from ...models.enum.account_role import AccountRole

user_bp = Blueprint('user', __name__)
user_bp.register_blueprint(user_video_bp, url_prefix='/video')
user_bp.register_blueprint(user_profile_bp, url_prefix='/profile')

@user_bp.route('/index')
def index():
    user = session.get('user')
    if user:
        return render_template('user/index.html', user=user)

    login_form = LoginForm(meta={'csrf_context': 'login'})
    register_form = RegisterForm(meta={'csrf_context': 'register'})

    register_csrf_token = generate_csrf(token_key='register_token')
    login_csrf_token = generate_csrf(token_key='login_token')
    login_form.csrf_token.data = login_csrf_token
    register_form.csrf_token.data = register_csrf_token

    return render_template('user/index.html', login_form=login_form, register_form=register_form)
