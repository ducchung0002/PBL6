from flask_socketio import SocketIO
from app.utils.elasticSearch import Search

socketio = SocketIO()


@socketio.on('connect')
def handle_connect():
    print('Client connected')


@socketio.on("search")
def handle_search(query):
    user_results = Search.Search_Users(query)
    music_results = Search.Search_Musics(query)
    lyric_results = Search.Search_Lyrics(query)
    artist_results = Search.Search_Artists(query)
    mixed = music_results + lyric_results
    sorted_mixed = sorted(mixed, key=lambda x: x["score"], reverse=True)
    if len(sorted_mixed) > 0:
        if sorted_mixed[0]["flag"] == "lyric":
            music_results = Search.get_music_results(lyric_results)

    results = {
        "musics": music_results[:5],
        "users": user_results[:5],
        "artists": artist_results[:5],
    }
    socketio.emit("search_results", results)


@socketio.on("music_search")
def handle_search(query):
    music_results = Search.Search_Musics(query)
    music_results_sorted = sorted(music_results, key=lambda x: x["score"], reverse=True)
    results = {
        "musics": music_results_sorted[:5]
    }
    socketio.emit("music_search_results", results)


@socketio.on("search feat artists")
def search_feat_artists(query):
    artists = Search.Search_Artists(query)
    socketio.emit("feat artists found", artists)
