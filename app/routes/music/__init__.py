from flask import Blueprint, render_template
from app.models.music import Music
music_bp = Blueprint('music', __name__)

@music_bp.route('/<string:music_id>', methods=['GET'])
def music_detail(music_id):
    music = Music.objects(id=music_id).first()
    lyric_results = []
    for lyric in music.lyrics:
        sentence = ""
        start_time = lyric[0].start_time
        end_time = lyric[len(lyric)-1].end_time
        for word in lyric:
            sentence += word.word + " "
        lyric_results.append({
            "sentence": sentence,
            "start_time": start_time,
            "end_time": end_time
        })
    return render_template('user/music/music-play.html', music=music.jsonify(), lyric_results=lyric_results)