document.getElementById('send-comment').addEventListener('click', function () {
    if (!sessionUser || !sessionId) {
        alert('Vui lòng đăng nhập để bình luận.');
        return;
    }

    const videoId = video_id;
    const commentContent = document.getElementById('input').value.trim();
    const userId = sessionId;

    if (!commentContent) {
        alert('Vui lòng nhập nội dung bình luận.');
        return;
    }

    // Kiểm tra hate_detection
    axios.post(`${api_video_comment}/hate_detection`, { content: commentContent })
        .then(response => {
            if (response.data.success) {
                const detectionResult = response.data.content;
                if (hate_regex.test(detectionResult) === true) {
                    // Vi phạm => hiển thị modal
                    const violationModal = new bootstrap.Modal(document.getElementById('violationWarningModal'));
                    violationModal.show();
                } else {
                    // Không vi phạm => gửi comment
                    axios.post(`${api_video_comment}/insert`, { videoId: videoId, content: commentContent, userId: userId })
                        .then(insertResponse => {
                            if (insertResponse.data.success) {
                                const newCommentId = insertResponse.data.comment_id;

                                // Tạo obj comment cha
                                let newComment = {
                                    id: newCommentId,
                                    user: sessionUser,
                                    content: commentContent,
                                    like_count: 0,
                                    dislike_count: 0,
                                    child_count: 0,
                                };
                                addNewComment(newCommentId,commentContent,videoId)
                                // clear input
                                document.getElementById('input').value = '';
                            } else {
                                alert('Đã xảy ra lỗi khi gửi bình luận: ' + insertResponse.data.error);
                            }
                        })
                        .catch(error => {
                            console.error('Error inserting comment:', error);
                            alert('Đã xảy ra lỗi khi gửi bình luận.');
                        });
                }
            } else {
                alert('Đã xảy ra lỗi trong quá trình kiểm tra bình luận.');
            }
        })
        .catch(error => {
            console.error('Error during hate detection:', error);
            alert('Đã xảy ra lỗi khi kiểm tra bình luận.');
        });
});
function addNewComment(comment_id,comment,video_id) {
    let comment_container = document.getElementById('comments');
    let new_comment = document.createElement('div');
    new_comment.className = 'comment';
    new_comment.setAttribute('data-comment-id', comment_id);
    new_comment.innerHTML = `
        <div class="avatar-container">
            <img class="rounded-circle" width="40" height="40" src="${sessionUser.avatar_url}" alt="Avatar">
        </div>
        <div class="comment-content">
            <div class="comment-header">${sessionUser.username } <span style="color: #888; font-weight: normal;">Just now</span></div>
            <div class="comment-body">
                <div class="comment-body-content" id="${comment_id}-body">
                    ${comment}
                </div>
            </div>
            <div class="comment-actions">
                <button class="like-button" onclick="watchingVideolikeComment('${comment_id}', '${video_id}' , this)">
                    <i class="bi bi-hand-thumbs-up"></i>
                </button>
                <span class="like-count" id="like-count-${comment_id}">0 likes</span>
                <span class="reply">Reply</span>
            </div>
        </div>
        <div class="circle-wrapper" onclick="handleClick(this)">
            <div class="circle">
                <div id="control-button"
                     style="width: 30px; height: 30px;">
                    <i class="bi bi-three-dots-vertical"></i>
                </div>
                <div class="popup-menu">
                    <div class="popup-item"
                         onclick="WatchingVideoEditComment('${video_id}','${comment_id}')">
                        <i class="bi bi-pencil-fill"></i>
                        <span>Chỉnh sửa</span>
                    </div>
                    <div class="popup-item"
                         style="color: red;"
                         onclick="WatchingVideoDeleteComment('${video_id}','${comment_id}')">
                        <i class="bi bi-trash3-fill"></i>
                        <span>Xóa</span>
                    </div>
                </div>
            </div>
        </div>`
    comment_container.prepend(new_comment);
}
