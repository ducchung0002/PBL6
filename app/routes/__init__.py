from flask import redirect, url_for

from app.models.enum.account_role import AccountRole
from app.routes.forms.login_form import LoginForm
from app.routes.forms.register_form import RegisterForm
import urllib.parse
from flask import Blueprint, render_template, request, session
from app.utils.elasticSearch import Search
from app.models.video import Video
from app.utils import time_ago
from app.models.base.extended_account import ExtendedAccount
from app.utils.elasticSearch.helpers import handle_account_results

home_bp = Blueprint('home', __name__)


@home_bp.route('/', methods=['GET'])
def index():
    user = session.get('user')
    if user:
        if user['role'] == AccountRole.ADMIN.value:
            return redirect(url_for('admin.index'))
        elif user['role'] == AccountRole.ARTIST.value:
            return redirect(url_for('artist.index'))

    return redirect(url_for('user.index'))

@home_bp.route('/search', methods=['GET'])
def search():
    query = request.args.get('q')
    decoded_query = urllib.parse.unquote(query)
    word_count = len(decoded_query.split())
    if word_count > 3:
        user_results = Search.Search_Users(decoded_query)
        artist_results = Search.Search_Artists(decoded_query)
        music_results = Search.Search_Musics(decoded_query)
        lyric_results = Search.Search_Lyrics(decoded_query)
        mixed = music_results + lyric_results + user_results + artist_results
        sorted_mixed = sorted(mixed, key=lambda x: x["score"], reverse=True)
        if len(sorted_mixed) == 0:
            return render_template('search/no_search_results.html')
        top_result = sorted_mixed[0]
        music_results = Search.handle_music_results(music_results)
        if top_result["flag"] == "lyric":
            top_result = Search.handle_top_result(top_result)
            music_results = Search.get_music_results(lyric_results)
        if top_result["flag"] == "artist":
            top_result = Search.handle_top_result(top_result)
            music_results = Search.get_artist_music_results(top_result["id"])
        if top_result["flag"] == "music":
            top_result = Search.handle_top_result(top_result)
            artist_results = Search.get_music_artist_results(music_results)
        if top_result["flag"] == "user":
            top_result = Search.handle_top_result(top_result)

    else:
        user_results = Search.Search_Users(decoded_query)
        artist_results = Search.Search_Artists(decoded_query)
        music_results = Search.Search_Musics(decoded_query)
        mixed = music_results + user_results + artist_results
        sorted_mixed = sorted(mixed, key=lambda x: x["score"], reverse=True)
        if len(sorted_mixed) == 0:
            return render_template('search/no_search_results.html')
        music_results = Search.handle_music_results(music_results)

        top_result = sorted_mixed[0]

        if top_result["flag"] == "artist" or top_result["flag"] == "user":
            top_result = Search.handle_top_result(top_result)
            music_results = Search.get_artist_music_results(top_result["id"])

        if top_result["flag"] == "music":
            top_result = Search.handle_top_result(top_result)
            artist_results = Search.get_music_artist_results(music_results)

    user_results = handle_account_results(user_results)
    artist_results = handle_account_results(artist_results)
    accounts_results = user_results + artist_results
    return render_template('search/search_results.html',
                           music_results=music_results,
                           user_results=user_results,
                           artist_results=artist_results,
                           accounts_results=accounts_results,
                           top_result=top_result)

@home_bp.route('/watch?v=<video_id>', methods=['GET'])
def watch(video_id):
    watching_video = Video.objects(id=video_id).first()
    watching_video.created_at = time_ago(watching_video.created_at)
    video_owner = watching_video.user.fetch()
    comments=[]
    user_id = session.get('user', {}).get('id')
    user = ExtendedAccount.objects(id=user_id).first()
    video_tuples = Video.objects.get_random_videos(5, user_id=user_id)
    videos = []
    for video, liked in video_tuples:
        video_json = video.jsonify(current_user=user)
        video['created_at'] = time_ago(video.created_at)
        video['thumbnail_url'] = video.thumbnail_url
        video_json['liked'] = liked
        videos.append(video_json)
    for comment in watching_video.comments:
        comment.created_at = time_ago(comment.created_at)
        owner = comment.user.fetch()
        comments.append({
            'id': comment.id,
            'user_id': comment.user,
            'content': comment.content,
            'created_at': comment.created_at,
            'owner': owner,
            'like_count': comment.like_count,
            'child_count': comment.child_count
        })
    music = watching_video.music.fetch()
    comments = sorted(comments, key=lambda x: x['created_at'], reverse=True)
    return render_template('video/watch.html',
                           watching_video=watching_video,
                           comments=comments,
                           videos=videos,
                           video_owner=video_owner,
                           music=music
                           )