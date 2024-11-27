import re

from mongoengine import Q

from app.models.admin import Admin
from app.models.artist import Artist
from app.models.user import User


def get_account_by_username(username):
    is_email = re.match(r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$', username) is not None
    query = Q(email=username) if is_email else Q(username=username)
    account = User.objects(query).first() or Artist.objects(query).first() or Admin.objects(username=username).first()
    return account
