from flask import Blueprint, render_template, request, session
from app.decorators import login_required
from app.models.base.extended_account import ExtendedAccount
from app.models.enum.account_role import AccountRole
from app.models.follow import Follow
artist_profile_bp = Blueprint('profile', __name__)
@artist_profile_bp.route('/home/<string:artist_id>', methods=['GET'])
@login_required(role=AccountRole.ARTIST)
def get_profile(artist_id):
    flag = 'home'
    artist = ExtendedAccount.objects(id=artist_id).first()
    follower_id = session['user']['id']
    follow_status = Follow.objects.get_follow_status(follower_id=follower_id, following_id=artist_id)
    return render_template('artist/profile/home.html',
                           artist=artist,
                           follow_status=follow_status,
                           flag=flag)
