from flask import Blueprint, render_template
from app.decorators import login_required

user_bp = Blueprint('user', __name__)

@user_bp.route('/dashboard')
@login_required(role='admin')
def dashboard():
    return render_template('user/dashboard.html')