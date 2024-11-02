from datetime import datetime

from flask import Blueprint, flash, redirect, render_template, request, url_for

from app.decorators import login_required
from app.models.artist import Artist
from app.routes.forms.add_artist_form import AddArtistForm
from models.enum.account_role import AccountRole

admin_artist_bp = Blueprint('artist', __name__)


@admin_artist_bp.route('/list', methods=['GET'])
@login_required(role=AccountRole.ADMIN)
def list():
    page = request.args.get('page', 1, type=int)
    per_page = 6  # Number of artists per page
    total_artists = Artist.objects.count()
    artists = Artist.objects.skip((page - 1) * per_page).limit(per_page)
    total_pages = (total_artists + per_page - 1) // per_page
    return render_template('admin/artist/list.html', artists=artists, page=page, per_page=per_page, total_pages=total_pages)


@admin_artist_bp.route('/add', methods=['GET', 'POST'])
@login_required(role=AccountRole.ADMIN)
def add():
    form = AddArtistForm()

    if form.validate_on_submit():
        name = form.name.data
        avatar_uri = form.avatar_uri.data
        username = form.email.data
        email = form.email.data
        date_of_birth = datetime.now()
        new_artist = Artist(username=username, email=email, date_of_birth=date_of_birth, name=name, avatar_url=avatar_uri)
        new_artist.save()

        flash('Artist added successfully!', 'success')
        return redirect(url_for('admin.artist.list'))

    return render_template('admin/artist/add.html', form=form)
