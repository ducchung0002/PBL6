# PBL6/app/routes/user/music/__init__.py
from flask import Blueprint, render_template, session, redirect, url_for
from app.decorators import login_required
from app.models.base.extended_account import ExtendedAccount
from app.models.artist import Artist
from app.models.music import Music
from bson import ObjectId
import logging

user_music_bp = Blueprint('music', __name__)

@user_music_bp.route('/show_music_home', methods=['GET'])
@login_required()
def show_music_home():
    # Lấy user hiện tại nếu cần
    user_session = session.get('user')

    try:
        current_user = ExtendedAccount.objects.get(id=ObjectId(user_session['id']))
        logging.debug(f"Tìm thấy người dùng với ID: {current_user.id}")
    except Exception as e:
        logging.error(f"Lỗi khi lấy user: {e}")
        return "User không hợp lệ", 400

    # Giả sử bạn có danh sách nghệ sĩ từ database
    # Ở đây ta lấy tất cả artist (role ARTIST)
    # Hoặc bạn có thể filter theo role=artist (nếu bạn lưu role trong Artist)
    # Nếu role chưa được lưu trực tiếp, có thể filter theo class Artist
    artists = Artist.objects()  # Lấy tất cả nghệ sĩ

    # Tạo cấu trúc dữ liệu: {artist: [list_musics]}
    # Lấy tất cả bài hát của mỗi nghệ sĩ
    artist_musics_data = []
    for artist in artists:
        # Lấy tất cả bài hát có artist này
        musics = Music.objects(artists=artist).order_by('name')  # Sắp xếp theo tên bài hát
        # Chuyển về danh sách dict để template dễ render
        musics_data = []
        for music in musics:
            musics_data.append({
                'id': str(music.id),
                'name': music.name,
                'audio_url': music.audio_url,
                'thumbnail_url': music.thumbnail_url
            })

        artist_musics_data.append({
            'artist_id': str(artist.id),
            'artist_name': artist.name,
            'artist_avatar': artist.avatar_url,
            'musics': musics_data
        })

    return render_template('user/music/music.html',
                           user=current_user,
                           artist_musics_data=artist_musics_data)
