from flask import Blueprint, redirect, render_template, session, url_for
from flask_wtf.csrf import generate_csrf

from app.models.enum.account_role import AccountRole
from app.models.video import Video
from app.routes.forms.login_form import LoginForm
from app.routes.forms.register_form import RegisterForm

home_bp = Blueprint('home', __name__)


@home_bp.route('/', methods=['GET'])
def index():
    user = session.get('user')
    if user:
        if user['role'] == AccountRole.ADMIN.value:
            return redirect(url_for('admin.index'))
        elif user['role'] == AccountRole.USER.value:
            return redirect(url_for('user.index'))
        elif user['role'] == AccountRole.ARTIST.value:
            return redirect(url_for('artist.index'))


    else:
        login_form = LoginForm(meta={'csrf_context': 'login'})
        register_form = RegisterForm(meta={'csrf_context': 'register'})
        videos = Video.objects().all()

        register_csrf_token = generate_csrf(token_key='register_token')
        login_csrf_token = generate_csrf(token_key='login_token')
        login_form.csrf_token.data = login_csrf_token
        register_form.csrf_token.data = register_csrf_token

        return render_template('user/index.html', login_form=login_form, register_form=register_form, videos=videos)
