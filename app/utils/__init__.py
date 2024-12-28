import re
from datetime import datetime

from mongoengine import Q

from app.models.admin import Admin
from app.models.artist import Artist
from app.models.user import User


def get_account_by_username(username):
    is_email = re.match(r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$', username) is not None
    query = Q(email=username) if is_email else Q(username=username)
    account = User.objects(query).first() or Artist.objects(query).first() or Admin.objects(username=username).first()
    return account

def time_ago(created_at):
    now = datetime.now()
    delta = now - created_at

    if delta.days >= 365:
        return f"{delta.days // 365} năm trước"
    elif delta.days >= 30:
        return f"{delta.days // 30} tháng trước"
    elif delta.days >= 7:
        return f"{delta.days // 7} tuần trước"
    elif delta.days >= 1:
        return f"{delta.days} ngày trước"
    elif delta.seconds >= 3600:
        return f"{delta.seconds // 3600} giờ trước"
    elif delta.seconds >= 60:
        return f"{delta.seconds // 60} phút trước"
    else:
        return "just now"