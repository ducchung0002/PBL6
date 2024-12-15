from flask import redirect, url_for

from app.models.enum.account_role import AccountRole
from app.routes.forms.login_form import LoginForm
from app.routes.forms.register_form import RegisterForm
import urllib.parse
from flask import Blueprint, render_template, request, session
from app.utils.elasticSearch import Search
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
        name_results = Search.Search_Accounts(decoded_query)
        music_results = Search.Search_Musics(decoded_query)
        lyric_results = Search.Search_Lyrics(decoded_query)
        mixed = music_results + lyric_results + name_results
        sorted_mixed = sorted(mixed, key=lambda x: x["score"], reverse=True)
        if len(sorted_mixed) == 0:
            return render_template('search/no_search_results.html')
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
            return render_template('search/no_search_results.html')
        name_results = Search.handle_account_results(name_results)
        music_results = Search.handle_music_results(music_results)

        top_result = sorted_mixed[0]

        if top_result["flag"] == "account":
            top_result = Search.handle_top_result(top_result)
            music_results = Search.get_artist_music_results(top_result["id"])

        if top_result["flag"] == "music":
            top_result = Search.handle_top_result(top_result)
            name_results = Search.get_music_artist_results(music_results)

    return render_template('search/search_results.html',
                           music_results=music_results,
                           account_results=name_results,
                           top_result=top_result)