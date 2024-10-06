from flask import Blueprint, render_template, session, redirect, url_for

from app.routes.forms.login_form import LoginForm
from app.routes.forms.register_form import RegisterForm
from app.models.video import Video

home_bp = Blueprint('home', __name__)


@home_bp.route('/', methods=['GET'])
def index():
    if session.get('user'):
        if session['user']['role'] == 'admin':
            # return session['user']
            return redirect(url_for('admin.dashboard'))
        elif session['user']['role'] == 'user':
            return redirect(url_for('user.dashboard'))
    else:
        login_form = LoginForm()
        register_form = RegisterForm()
        videos = Video.objects().all()
        return render_template('user/home.html', login_form=login_form, register_form=register_form, videos=videos)
