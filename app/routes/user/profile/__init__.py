from flask import Blueprint, render_template, session

from app.decorators import login_required
from app.models.base.extended_account import ExtendedAccount
from app.models.enum.account_role import AccountRole
from app.models.follow import Follow
from app.models.video import Video
from app.utils import time_ago

user_profile_bp = Blueprint('profile', __name__)

@user_profile_bp.route('/home/<string:user_id>', methods=['GET'])
@login_required(role=[AccountRole.USER, AccountRole.ARTIST])
def get_profile(user_id):
    flag = 'home'
    user = ExtendedAccount.objects(id=user_id).first()
    videos = Video.objects.get_videos_by_user(user_id)

    video_popular = sorted(videos, key=lambda video: video.like_count, reverse=True)
    video_latest = sorted(videos, key=lambda video: video.created_at, reverse=True)
    video_oldest = sorted(videos, key=lambda video: video.created_at, reverse=False)
    for video in videos:
        video.created_at = time_ago(video.created_at)
    follower_id = session['user']['id']
    follow_status = Follow.objects.get_follow_status(follower_id=follower_id, following_id=user_id)
    return render_template('user/profile/home.html',
                           user=user,
                           follow_status=follow_status,
                           flag=flag,
                           video_popular=video_popular,
                           video_latest=video_latest,
                           video_oldest=video_oldest)