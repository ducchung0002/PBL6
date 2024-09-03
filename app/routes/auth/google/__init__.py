import os

from dotenv import load_dotenv
from flask import Blueprint, abort, url_for, render_template
from flask import request, session, redirect

import requests
from app.models.user import User
from google_auth_oauthlib.flow import Flow
from google.oauth2 import id_token
from google.auth.transport.requests import Request
from pip._vendor import cachecontrol
from pathlib import Path

from app.routes.forms.register_google_form import RegisterGoogleForm

google_oauth_blueprint = Blueprint('google', __name__)

load_dotenv()
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

GOOGLE_CLIENT_ID = os.environ.get('GOOGLE_CLIENT_ID')
client_secrets_file = str(Path(__file__).resolve().parents[4] / "client_secret.json")
flow = Flow.from_client_secrets_file(
    client_secrets_file=client_secrets_file,
    scopes=['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile',
            'openid'],
    redirect_uri='http://127.0.0.1:5000/auth/google/callback',
)


@google_oauth_blueprint.route('/login', methods=['GET','POST'])
def login():
    authorization_url, state = flow.authorization_url()
    session['state'] = state
    return redirect(authorization_url)


@google_oauth_blueprint.route('/callback')
def callback():
    flow.fetch_token(authorization_response=request.url)

    if not session["state"] == request.args["state"]:
        abort(500)  # State does not match!

    credentials = flow.credentials
    request_session = requests.session()
    cached_session = cachecontrol.CacheControl(request_session)
    token_request = Request(session=cached_session)

    id_info = id_token.verify_oauth2_token(
        id_token=credentials._id_token,
        request=token_request,
        audience=GOOGLE_CLIENT_ID
    )

    email = id_info.get("email")
    user = User.get_by_email(email)
    if not user:
        return redirect(url_for('auth.google.register', email=email))
    else:
        session['user'] = user.to_json()
        return redirect(url_for('home.index'))



@google_oauth_blueprint.route('/register', methods=['GET', 'POST'])
def register():
    email = request.args.get('email')
    register_google_form = RegisterGoogleForm()
    if email is not None:
        register_google_form.email.data = email

    if register_google_form.validate_on_submit():
        email = register_google_form.email.data
        name = register_google_form.name.data
        date_of_birth = register_google_form.date_of_birth.data

        user = User(name=name, email=email, date_of_birth=date_of_birth).create()
        # return redirect(url_for('auth.login'))
        # session['user'] = user.to_json()
        return redirect(url_for('auth.login'))
    return render_template('auth/google/register.html', register_google_form=register_google_form)
