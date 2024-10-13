from flask import Blueprint, redirect, session, url_for

from app.models.enum.account_role import AccountRole
from app.routes.forms.login_form import LoginForm
from app.routes.forms.register_form import RegisterForm

home_bp = Blueprint('home', __name__)


@home_bp.route('/', methods=['GET'])
def index():
    user = session.get('user')
    if user:
        if user['role'] == AccountRole.ADMIN.value:
            return redirect(url_for('admin.index'))
        elif user['role'] == AccountRole.ARTIST.value:
            return redirect(url_for('artist.index'))

    return redirect(url_for('user.index'))