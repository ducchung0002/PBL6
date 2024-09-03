from flask import render_template

from . import admin_bp
from app.decorators import login_required

@admin_bp.route('/dashboard')
@login_required(role='admin')
def dashboard():
    return render_template('admin/dashboard.html')