from flask import Blueprint, jsonify, request, flash, redirect, url_for, render_template, session
from flask_jwt_extended import get_jwt_identity

from app.decorators import login_required
from app.models.user import User
from app.models.music import Music
from app.routes.forms.add_music_form import AddMusicForm

artist_music_bp = Blueprint('music', __name__)


@artist_music_bp.route('/add', methods=['GET', 'POST'])
@login_required(role='admin')
def add():
    form = AddMusicForm()

    if form.validate_on_submit():
        name = form.name.data
        lyric = form.lyric.data
        uri = form.uri.data

        new_music = Music(name=name, lyric=lyric, uri=uri)
        new_music.save()

        flash('Music added successfully!', 'success')
        return redirect(url_for('music.list'))

    return render_template('admin/music/add.html', form=form)


@artist_music_bp.route('/list', methods=['GET'])
@login_required(role='artist')
def list():
    musics = Music.get_all_music()
    return render_template('components/music/list_music.html', musics=musics)
