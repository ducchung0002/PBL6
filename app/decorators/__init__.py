from functools import wraps
from flask import session, redirect, url_for, flash


def login_required(role='user'):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if 'user' not in session:
                return redirect(url_for('auth.login'))
            if role and session['user'].get('role') != role:
                flash(f'Unauthorized access. {role.capitalize()} privileges required.', 'error')
                return redirect(url_for('home.index'))
            return f(*args, **kwargs)
        return decorated_function
    return decorator

# def admin_required(f):
#     @wraps(f)
#     def decorated_function(*args, **kwargs):
#         if 'user' not in session:
#             return redirect(url_for('auth.login'))
#         if session['user'].get('role') != 'admin':
#             flash('Unauthorized access. Admin privileges required.', 'error')
#             return redirect(url_for('home.index'))
#     return decorated_function

def singleton(cls):
    instances = {}

    def get_instance(*args, **kwargs):
        if cls not in instances:
            instances[cls] = cls(*args, **kwargs)
        return instances[cls]

    return get_instance
