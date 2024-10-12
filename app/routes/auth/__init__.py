from flask import Blueprint, session, flash, redirect, url_for, render_template, request
from flask_jwt_extended import create_access_token
import re
from app.models.base.account import Account
from app.models.enum.account_role import AccountRole
from app.models.user import User
from app.routes.auth.google import google_oauth_blueprint
from app.routes.forms.login_form import LoginForm
from app.routes.forms.register_form import RegisterForm
from models.base.extended_account import ExtendedAccount

auth_bp = Blueprint('auth', __name__)
auth_bp.register_blueprint(google_oauth_blueprint, url_prefix='/google')


@auth_bp.route('/login', methods=['POST'])
def login():
    form = LoginForm(request.form)
    if form.validate_on_submit():
        pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
        if re.match(pattern, form.username.data):
            user = ExtendedAccount.objects(email=form.username.data).first()
        else:
            user = Account.objects(username=form.username.data).first()

        if user is not None:
            chk = user.check_password(form.password.data)
            # access_token = create_access_token(identity=str(user.id))

            if chk is None:
                flash('Mật khẩu không chính xác')
                return redirect(url_for('auth.login'))
            if chk is True:
                session['user'] = user.to_json()
                # session['access_token'] = access_token
                if user.role == AccountRole.ADMIN.value:
                    return redirect(url_for('admin.index'))
                elif user.role == AccountRole.USER.value:
                    return redirect(url_for('user.index'))
                elif user.role == AccountRole.ARTIST.value:
                    return redirect(url_for('artist.index'))
        else:
            flash('Invalid email or password', 'danger')

    return redirect(url_for('home.index'))


@auth_bp.route('/register', methods=['POST'])
def register():
    form = RegisterForm()
    login_form = LoginForm()
    register_form = RegisterForm()

    if form.validate_on_submit():
        name = form.name.data
        email = form.email.data
        username = form.username.data
        password = form.password.data
        date_of_birth = form.date_of_birth.data

        user = User(name=name, username=username, email=email, date_of_birth=date_of_birth).set_password(password).save()
        # session['user'] = user.to_json()
        return redirect(url_for('home.index'))
    return render_template('auth/modals/register.html', form=form, login_form=login_form, register_form=register_form)


@auth_bp.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('home.index'))
