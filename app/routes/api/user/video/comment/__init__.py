from flask import Blueprint, request, jsonify
from models.video import Video

api_user_video_comment_bp = Blueprint('api_user_video_comment', __name__)

@api_user_video_comment_bp.route('/insert', methods=['POST'])
def insert_comment():
    data = request.json
    video_id = data.get('videoId')
    content = data.get('content')
    user_id = data.get('userId')
    to_comment_id = data.get('toCommentId')

    try:
        # Thêm comment vào video
        comment_id = Video.objects.add_comment(user_id=user_id, video_id=video_id, content=content,
                                               to_comment_id=to_comment_id)
        comment_id = str(comment_id)

        # Lấy video để lấy comment mới nhất và chuyển đổi sang JSON
        video = Video.objects.get(id=video_id)
        new_comment = video.comments[-1].jsonify()  # Lấy comment mới nhất và gọi jsonify()

        response = {
            "success": True,
            "comment_id": comment_id,
            "new_comment": new_comment  # Trả về dữ liệu comment mới nhất bao gồm avatar_url
        }

    except Exception as e:
        response = {
            "success": False,
            "error": str(e)
        }
        return jsonify(response), 400

    return jsonify(response), 200
@api_user_video_comment_bp.route('/edit', methods=['PUT'])
def edit_comment():
    data = request.json
    comment_id = data.get('commentId')
    new_content = data.get('content')
    video_id = data.get('videoId')

    print(comment_id, new_content, video_id)


    success = Video.objects.update_comment(video_id, comment_id, new_content)  # Giả sử có phương thức để lấy comment theo ID

    return jsonify({"success": success}), 200

@api_user_video_comment_bp.route('/delete', methods=['POST'])
def delete_comment():
    data = request.json
    video_id = data.get('videoId')
    comment_id = data.get('commentId')

    # Thêm logging để kiểm tra dữ liệu nhận được
    print(f"Received delete request - Video ID: {video_id}, Comment ID: {comment_id}")

    if not video_id or not comment_id:
        return jsonify({"success": False, "error": "Missing videoId or commentId"}), 400

    try:
        # Gọi phương thức xóa bình luận trong model Video
        success = Video.objects.delete_comment(video_id, comment_id)
        print(f"Delete comment success: {success}")

        response = {"success": success}
    except Exception as e:
        print(f"Error deleting comment: {e}")
        response = {"success": False, "error": str(e)}
        return jsonify(response), 500

    return jsonify(response), 200
