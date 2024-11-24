from flask import Blueprint, jsonify, request
from app.models.base.extended_account import ExtendedAccount
from app.models.follow import Follow
api_user_follow_bp = Blueprint('api_user_follow', __name__)
@api_user_follow_bp.route('/create', methods=['POST'])
def follow():
    data = request.get_json()
    following_id = data.get('following_id')
    follower_id = data.get('follower_id')
    Follow.objects.follow(follower_id=follower_id, following_id=following_id)
    return jsonify({'message': 'Follow success'}), 200
@api_user_follow_bp.route('/delete', methods=['DELETE'])
def unfollow():
    data = request.get_json()
    following_id = data.get('following_id')
    follower_id = data.get('follower_id')
    Follow.objects.unfollow(follower_id=follower_id, following_id=following_id)
    return jsonify({'success': True, 'message': 'Unfollow success'}), 200
@api_user_follow_bp.route('/following', methods=['POST'])
def get_following():
    data = request.get_json()
    user_id = data['user_id']
    followings = Follow.objects.get_following(follower_id=user_id)
    followings = [acc.jsonify() for acc in ExtendedAccount.objects(id__in=[fl.following.id for fl in followings])]
    return jsonify({'following': followings}), 200
@api_user_follow_bp.route('/follower', methods=['POST'])
def get_followers():
    data = request.get_json()
    user_id = data['user_id']
    followers = Follow.objects.get_follower(following_id=user_id)
    followers = [acc.jsonify() for acc in ExtendedAccount.objects(id__in=[fl.follower.id for fl in followers])]
    return jsonify({'follower': followers}), 200