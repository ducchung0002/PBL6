from flask import Blueprint, jsonify, render_template
from app.models.music import Music
from app.decorators import login_required
from app.models.enum.account_role import AccountRole
from app.utils.elasticSearch.helpers import get_artist_results

user_music_bp = Blueprint('music', __name__)

@user_music_bp.route('/<string:music_id>', methods=['GET'])
@login_required(role=[AccountRole.USER, AccountRole.ARTIST])
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