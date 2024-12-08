import urllib.parse
from flask import Blueprint, render_template, request, session
from flask_wtf.csrf import generate_csrf
from app.utils.elasticSearch import Search
from .profile import user_profile_bp
from .video import user_video_bp
from .music import user_music_bp
from ..forms.login_form import LoginForm
from ..forms.register_form import RegisterForm

user_bp = Blueprint('user', __name__)
user_bp.register_blueprint(user_video_bp, url_prefix='/video')
user_bp.register_blueprint(user_profile_bp, url_prefix='/profile')
user_bp.register_blueprint(user_music_bp, url_prefix='/music')

@user_bp.route('/index')
def index():
    user = session.get('user')
    if user:
        return render_template('user/index.html', user=user)

    login_form = LoginForm(meta={'csrf_context': 'login'})
    register_form = RegisterForm(meta={'csrf_context': 'register'})

    register_csrf_token = generate_csrf(token_key='register_token')
    login_csrf_token = generate_csrf(token_key='login_token')
    login_form.csrf_token.data = login_csrf_token
    register_form.csrf_token.data = register_csrf_token

    return render_template('user/index.html', login_form=login_form, register_form=register_form)

@user_bp.route('/search', methods=['GET'])
def search():
    query = request.args.get('q')
    decoded_query = urllib.parse.unquote(query)
    word_count = len(decoded_query.split())
    if word_count > 3:
        name_results = Search.Search_Accounts(decoded_query)
        music_results = Search.Search_Musics(decoded_query)
        lyric_results = Search.Search_Lyrics(decoded_query)
        mixed = music_results + lyric_results + name_results
        sorted_mixed = sorted(mixed, key=lambda x: x["score"], reverse=True)
        if len(sorted_mixed) == 0:
            return render_template('user/no_search_results.html')
        top_result = sorted_mixed[0]
        music_results = Search.handle_music_results(music_results)
        if top_result["flag"] == "lyric":
            top_result = Search.handle_top_result(top_result)
            music_results = Search.get_music_results(lyric_results)
        if top_result["flag"] == "account":
            top_result = Search.handle_top_result(top_result)
            music_results = Search.get_artist_music_results(top_result["id"])
        if top_result["flag"] == "music":
            top_result = Search.handle_top_result(top_result)
            name_results = Search.get_music_artist_results(music_results)

    else:
        name_results = Search.Search_Accounts(decoded_query)
        music_results = Search.Search_Musics(decoded_query)
        mixed = music_results + name_results
        sorted_mixed = sorted(mixed, key=lambda x: x["score"], reverse=True)
        if len(sorted_mixed) == 0:
            return render_template('user/no_search_results.html')
        name_results = Search.handle_account_results(name_results)
        music_results = Search.handle_music_results(music_results)

        top_result = sorted_mixed[0]

        if top_result["flag"] == "account":
            top_result = Search.handle_top_result(top_result)
            music_results = Search.get_artist_music_results(top_result["id"])

        if top_result["flag"] == "music":
            top_result = Search.handle_top_result(top_result)
            name_results = Search.get_music_artist_results(music_results)

    return render_template('user/search_results.html',
                           music_results=music_results,
                           account_results=name_results,
                           top_result=top_result)