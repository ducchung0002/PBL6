from flask import Blueprint, session, flash, redirect, url_for, render_template

from app.models.user import User
from app.routes.auth.google import google_oauth_blueprint
from app.routes.forms.login_form import LoginForm
from app.routes.forms.register_form import RegisterForm

auth_bp = Blueprint('auth', __name__)
auth_bp.register_blueprint(google_oauth_blueprint, url_prefix='/google')

@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()

    if form.validate_on_submit():
        # Find the user by email
        user = User.objects(email=form.email.data).first()

        if user and user.check_password(form.password.data):  # Assuming you have a method to check passwords
            session['user'] = user.to_json()
            flash('Login successful', 'success')
            return redirect(url_for('home.index'))  # Redirect to home page
        else:
            flash('Invalid email or password', 'danger')

    return render_template('auth/login.html', form=form)

@auth_bp.route('/register',methods=['GET', 'POST'])
def register():
    form = RegisterForm()

    if form.validate_on_submit():
        name = form.name.data
        email = form.email.data
        password = form.password.data
        date_of_birth = form.date_of_birth.data

        User(name=name, email=email, password=password, date_of_birth=date_of_birth).create()
        return redirect(url_for('auth.login'))

        # Create a new us
    return render_template('auth/register.html', form=form)


@auth_bp.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('home.index'))  # Redirect to home page