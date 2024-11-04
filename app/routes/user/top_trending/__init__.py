import logging

from bson import ObjectId
from flask import Blueprint, render_template, session, redirect, url_for

from app.decorators import login_required
from app.models.base.extended_account import ExtendedAccount
from app.models.video import Video

top_trending_bp = Blueprint('top_trending', __name__)


@top_trending_bp.route('/trending', methods=['GET'])
@login_required()
def show_top_trending():
    # Lấy user hiện tại nếu cần
    user_session = session.get('user')

    try:
        user = ExtendedAccount.objects.get(id=ObjectId(user_session['id']))
        logging.debug(f"Tìm thấy người dùng với ID: {user.id}")
    except Exception as e:
        logging.error(f"Lỗi khi lấy user: {e}")
        return "User không hợp lệ", 400

    # Lấy tất cả video và sắp xếp theo like_count giảm dần
    # Bạn có thể điều chỉnh số lượng nếu muốn giới hạn
    all_videos = Video.objects().order_by('-like_count')

    # Giả sử bạn cần top_artists cho sidebar
    # Ví dụ lấy top 3 artists (nếu có)
    top_artists = []  # Bạn cần chỉnh lại logic để lấy nghệ sĩ từ DB
    # top_artists = Artist.objects()[:3]  # Ví dụ, nếu có model Artist

    return render_template('user/top_trending/top_trending.html',
                           all_videos=all_videos,
                           top_artists=top_artists,
                           user=user)
