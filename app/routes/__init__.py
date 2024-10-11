from flask import Blueprint, render_template, session, redirect, url_for
from flask_wtf.csrf import generate_csrf
from app.models.enum.account_role import AccountRole
from app.routes.forms.login_form import LoginForm
from app.routes.forms.register_form import RegisterForm
from app.models.video import Video

home_bp = Blueprint('home', __name__)


@home_bp.route('/', methods=['GET'])
def index():
    if session.get('user'):
        if session['user']['role'] == AccountRole.ADMIN:
            # return session['user']
            return redirect(url_for('admin.index'))
        elif session['user']['role'] == AccountRole.USER:
            return redirect(url_for('user.index'))
        else:
            return redirect(url_for('artist.index'))
    else:
        login_form = LoginForm(meta={'csrf_context': 'login'})
        register_form = RegisterForm(meta={'csrf_context': 'register'})
        videos = Video.objects().all()

        register_csrf_token = generate_csrf(token_key='register_token')
        login_csrf_token = generate_csrf(token_key='login_token')
        print(register_csrf_token)
        print(login_csrf_token)
        login_form.csrf_token.data = login_csrf_token
        register_form.csrf_token.data = register_csrf_token

        return render_template('user/index.html', login_form=login_form, register_form=register_form, videos=videos)
