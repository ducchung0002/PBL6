import logging
from datetime import datetime

from bson import ObjectId
from flask import Blueprint, render_template, session, request

from app.decorators import login_required
from app.models.base.extended_account import ExtendedAccount

have_seen_videos_bp = Blueprint('have_seen_videos', __name__)


@have_seen_videos_bp.route('/watched_videos', methods=['GET'])
@login_required()
def show_watched_videos():
    user_session = session.get('user')

    try:
        user = ExtendedAccount.objects.get(id=ObjectId(user_session['id']))
        logging.debug(f"Tìm thấy người dùng với ID: {user.id}")
    except Exception as e:
        logging.error(f"Lỗi khi lấy user: {e}")
        return "User không hợp lệ", 400

    like_videos_lazy = user.like_videos
    like_videos = [video.fetch() for video in like_videos_lazy if video]

    q = request.args.get('q', '').strip().lower()
    no_results_search = False  # Biến đánh dấu không tìm thấy kết quả tìm kiếm

    if like_videos:
        like_videos_sorted = like_videos[::-1]
        if q:
            # Tạo 1 bản copy của danh sách gốc trước khi lọc
            original_like_videos_sorted = like_videos_sorted[:]
            # Lọc theo từ khóa
            filtered = [v for v in like_videos_sorted if q in v.title.lower()]
            if filtered:
                # Có kết quả sau khi lọc
                like_videos_sorted = filtered
            else:
                # Không có kết quả sau khi lọc
                no_results_search = True
                # Giữ nguyên danh sách video cũ (không lọc)
                like_videos_sorted = original_like_videos_sorted

        last_video = like_videos_sorted[0] if like_videos_sorted else None
        all_videos = like_videos_sorted[1:] if len(like_videos_sorted) > 1 else []
        current_date = datetime.now()
    else:
        # Không có video nào cả
        last_video = None
        all_videos = []
        current_date = datetime.now()

    return render_template('user/have_seen_videos/have_seen_videos.html',
                           last_video=last_video,
                           all_videos=all_videos,
                           current_date=datetime.now(),
                           no_results_search=no_results_search,
                           q=q)
