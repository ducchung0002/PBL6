from functools import wraps

from flask import redirect, session, url_for

from app.models.enum.account_role import AccountRole


def login_required(role=AccountRole.USER.value):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if 'user' not in session:
                return redirect(url_for('home.index'))
            if session['user'].get('role') != role.value:
                return redirect(url_for('home.index'))
            return f(*args, **kwargs)

        return decorated_function

    return decorator


def singleton(cls):
    instances = {}

    def get_instance(*args, **kwargs):
        if cls not in instances:
            instances[cls] = cls(*args, **kwargs)
        return instances[cls]

    return get_instance
