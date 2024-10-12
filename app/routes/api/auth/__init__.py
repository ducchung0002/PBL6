from flask import Blueprint

from app.routes.api.auth.login import api_auth_login_bp
from app.routes.api.auth.register import api_auth_register_bp

api_auth_bp = Blueprint('api_auth', __name__)
api_auth_bp.register_blueprint(api_auth_login_bp, url_prefix='/login')
api_auth_bp.register_blueprint(api_auth_register_bp, url_prefix='/register')

