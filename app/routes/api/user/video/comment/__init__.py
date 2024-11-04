from flask import Blueprint, request, jsonify
from app.models.video import Video

api_user_video_comment_bp = Blueprint('api_user_video_comment', __name__)


@api_user_video_comment_bp.route('/insert', methods=['POST'])
def insert_comment():
    data = request.json
    video_id = data.get('videoId')
    content = data.get('content')
    user_id = data.get('userId')
    father_comment_id = data.get('fatherCommentId', None)
    grand_comment_id = data.get('grandCommentId', None)

    if (father_comment_id is None) != (grand_comment_id is None):
        response = {
            "success": False,
            "error": "Both fatherCommentId and grandCommentId must be provided"
        }
        return jsonify(response), 200

    try:
        # Thêm comment vào video
        comment_id = Video.objects.add_comment(user_id=user_id, video_id=video_id, content=content,
                                               father_comment_id=father_comment_id, grand_comment_id=grand_comment_id)
        comment_id = str(comment_id)

        response = {
            "success": True,
            "comment_id": comment_id,
        }

    except Exception as e:
        response = {
            "success": False,
            "error": str(e)
        }
        return jsonify(response), 200

    return jsonify(response), 201


@api_user_video_comment_bp.route('/edit', methods=['PUT'])
def edit_comment():
    data = request.json
    comment_id = data.get('commentId')
    new_content = data.get('content')
    video_id = data.get('videoId')

    print(comment_id, new_content, video_id)

    success = Video.objects.update_comment(video_id, comment_id,
                                           new_content)  # Giả sử có phương thức để lấy comment theo ID

    return jsonify({"success": success}), 200


@api_user_video_comment_bp.route('/delete', methods=['POST'])
def delete_comment():
    data = request.json
    video_id = data.get('videoId')
    comment_id = data.get('commentId')

    if not video_id or not comment_id:
        return jsonify({"success": False, "error": "Missing videoId or commentId"}), 400

    try:
        # Gọi phương thức xóa bình luận trong model Video
        Video.objects.delete_comment(video_id, comment_id)
        response = {"success": True}
    except Exception as e:
        print(f"Error deleting comment: {e}")
        response = {"success": False, "error": str(e)}
        return jsonify(response), 500

    return jsonify(response), 200

@api_user_video_comment_bp.route('/get_replies', methods=['POST'])
def get_replies():
    data = request.json
    comment_id = data.get('commentId')
    video_id = data.get('videoId')
    skip = data.get('skip', 0)

    if not comment_id or not video_id:
        return jsonify({"success": False, "error": "Missing videoId or commentId"}), 400

    try:
        # Gọi phương thức lấy các bình luận con của một bình luận
        replies = Video.objects.get_replies(video_id, comment_id, skip)
        from app.models.embedded_document.comment import Comment
        rep = [Comment.from_dict(**reply).jsonify() for reply in replies]
        response = {"success": True, "replies": rep}
    except Exception as e:
        print(f"Error getting replies: {e}")
        response = {"success": False, "error": str(e)}
        return jsonify(response), 500

    return jsonify(response), 200