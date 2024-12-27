from flask import Blueprint, render_template, request, session

from app.decorators import login_required
from app.models.enum.account_role import AccountRole
from app.models.genre import Genre
from app.models.music import Music

artist_music_bp = Blueprint('music', __name__)

DEFAULT_MUSIC_PER_PAGE = 5
MIN_MUSIC_PER_PAGE = 2
MAX_MUSIC_PER_PAGE = 10


@artist_music_bp.route('/add', methods=['GET'])
@login_required(role=AccountRole.ARTIST)
def add():
    return render_template('artist/music/add.html', genres=Genre.objects.all())


@artist_music_bp.route('/list', methods=['GET'])
@login_required(role=AccountRole.ARTIST)
def list_all():
    page = request.args.get('page', 1, type=int)
    limit = max(MIN_MUSIC_PER_PAGE, min(request.args.get('limit', DEFAULT_MUSIC_PER_PAGE, type=int), MAX_MUSIC_PER_PAGE))
    skip_count = (page - 1) * limit
    musics, total_music_items = Music.objects.get_music_by_artist(session['user']['id'], skip_count, limit)
    total_pages = (total_music_items + limit - 1) // limit
    return render_template('artist/music/list.html', musics=musics, page=page, limit=limit, total_pages=total_pages)
