from flask import Blueprint, render_template, session

from app.models.video import Video
from app.routes.forms.login_form import LoginForm
from app.routes.forms.register_form import RegisterForm
home_bp = Blueprint('home', __name__)

@home_bp.route('/', methods=['GET'])
def index():
    login_form = LoginForm()
    register_form = RegisterForm()
    videos = Video.objects().all()
    return render_template('user/home.html', login_form=login_form, register_form=register_form, videos=videos)