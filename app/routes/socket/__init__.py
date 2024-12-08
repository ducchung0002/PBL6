from flask_socketio import SocketIO
from app.utils.elasticSearch import Search

socketio = SocketIO()
@socketio.on('connect')
def handle_connect():
    print('Client connected')


@socketio.on("search")
def handle_search(query):
    name_results = Search.Search_Accounts(query)
    music_results = Search.Search_Musics(query)
    lyric_results = Search.Search_Lyrics(query)
    name = Search.handle_account_results(name_results)
    mixed = music_results + lyric_results
    sorted_mixed = sorted(mixed, key=lambda x: x["score"], reverse=True)
    if len(sorted_mixed) > 0:
        if sorted_mixed[0]["flag"] == "lyric":
            music_results = Search.get_music_results(lyric_results)

    results = {
        "musics": music_results[:8],
        "names": name
    }
    socketio.emit("search_results", results)
