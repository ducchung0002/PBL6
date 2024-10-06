from datetime import datetime

from flask import Blueprint, jsonify, request, flash, redirect, url_for, render_template, session
from flask_jwt_extended import get_jwt_identity

from app.decorators import login_required
from app.models.artist import Artist
from app.routes.forms.add_artist_form import AddArtistForm

admin_artist_bp = Blueprint('artist', __name__)

@admin_artist_bp.route('/list', methods=['GET'])
@login_required(role='admin')
def list():
    artists = Artist.get_all_artist()
    return render_template('admin/artist/list.html', artists=artists)


@admin_artist_bp.route('/add', methods=['GET', 'POST'])
@login_required(role='admin')
def add():
    form = AddArtistForm()

    if form.validate_on_submit():
        name = form.name.data
        avatar_uri = form.avatar_uri.data
        username = form.email.data
        email = form.email.data
        date_of_birth = datetime.now()
        new_artist = Artist(username=username, email=email,date_of_birth=date_of_birth,name=name, avatar_url=avatar_uri)
        new_artist.save()

        flash('Artist added successfully!', 'success')
        return redirect(url_for('admin.artist.list'))

    return render_template('admin/artist/add.html', form=form)



