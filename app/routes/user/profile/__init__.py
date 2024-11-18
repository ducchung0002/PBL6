from bson import ObjectId
from flask import Blueprint, render_template, request, session

from decorators import login_required
from models.user import User
from models.enum.account_role import AccountRole
from utils.sanitizer import sanitize_html

user_profile_bp = Blueprint('profile', __name__)

@user_profile_bp.route('/home/<string:user_id>', methods=['GET'])
@login_required(role=AccountRole.USER)
def get_profile(user_id):
    user = User.objects.get(id=ObjectId(user_id))
    return render_template('user/profile/home.html', user=user)
