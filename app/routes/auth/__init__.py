from flask import Blueprint, session, flash, redirect, url_for, render_template, request
from flask_jwt_extended import create_access_token

from app.models.user import User
from app.routes.auth.google import google_oauth_blueprint
from app.routes.forms.login_form import LoginForm
from app.routes.forms.register_form import RegisterForm

auth_bp = Blueprint('auth', __name__)
auth_bp.register_blueprint(google_oauth_blueprint, url_prefix='/google')


@auth_bp.route('/login', methods=['POST', 'GET'])
def login():
    form = LoginForm(request.form)
    if request.method == 'GET':
        return redirect(url_for('home.index'))
    if form.validate_on_submit():
        user = User.objects(email=form.email.data).first()

        if user is not None:
            chk = user.check_password(form.password.data)
            access_token = create_access_token(identity=str(user.id))

            if chk is None:
                flash('Please login by Google account')
                return render_wtemplate(url_for('home.index'))
            if chk is True:
                session['user'] = user.to_json()
                session['access_token'] = access_token

                if user.role == 'admin':
                    return redirect(url_for('admin.dashboard'))
                elif user.role == 'user':
                    return redirect(url_for('home.index'))
        else:
            flash('Invalid email or password', 'danger')


@auth_bp.route('/register', methods=['GET', 'POST'])
def register():
    form = RegisterForm()
    login_form = LoginForm()
    register_form = RegisterForm()

    if form.validate_on_submit():
        name = form.name.data
        email = form.email.data
        password = form.password.data
        date_of_birth = form.date_of_birth.data

        user = User(name=name, email=email, password=password, date_of_birth=date_of_birth).save()
        # session['user'] = user.to_json()
        return redirect(url_for('auth.login'))
    return render_template('auth/modals/register.html', form=form,login_form=login_form,register_form=register_form)

@auth_bp.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('home.index'))