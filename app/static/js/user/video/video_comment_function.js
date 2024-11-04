/* Render Comment */
function renderCommentsForVideo(video) {
    const commentContainer = document.getElementById('comment-container');
    commentContainer.innerHTML = ''; // Xóa các bình luận cũ
    let ul = document.createElement('ul');
    ul.classList.add('list-unstyled');
    video.comments.forEach(comment => {
        let li = renderComment(comment);
        ul.appendChild(li);
    });
    commentContainer.appendChild(ul);
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* Toggle Reply Section */
function toggleReplySection(commentId) {
    const replySection = document.getElementById(`reply-section-${commentId}`);
    replySection.classList.toggle('d-none');
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* view replies */
function viewReplies(event) {
    let btn = event.target;
    let skip = parseInt(btn.getAttribute('data-reply-skip'));
    let child_count = btn.getAttribute('data-child-count');
    let commentId = btn.getAttribute('data-comment-id');
    let video = videos[currentIndex];

    axios.post(`${api_video_comment}/get_replies`, {videoId: video.id, commentId: commentId, skip: skip})
        .then(response => {
            console.log(response.data);
            if (response.data.success) {
                const replies = response.data.replies;
                console.log('replies:', replies);
                skip += replies.length;
                btn.setAttribute('data-reply-skip', skip);
                let numLeftComments = parseInt(child_count) - skip;
                alert(`Xem thêm ${parseInt(child_count) - skip} bình luận`);
                btn.innerText = `Xem thêm ${parseInt(child_count) - skip} bình luận`;

                let ul = document.getElementById(`replies-container-${commentId}`);
                response.data.replies.forEach(reply => {
                    let li = renderComment(reply, 'reply', commentId);
                    ul.appendChild(li);
                })
            }
        })
        .catch(error => console.error('Error viewing replies:', error));
}

/* Submit Reply */
function submitReply(input, fatherCommentId, grandCommentId, father_comment_user = null) {
    const replyContent = input.value.trim();

    if (replyContent) {
        // console.log("father comment ID:", fatherCommentId);
        // console.log("grand comment ID:", grandCommentId);
        // console.log("Sending reply content:", replyContent); // kiểm tra nội dung phản hồi
        let data = {
            videoId: videos[currentIndex].id,
            content: replyContent,
            userId: sessionUser.id,
            fatherCommentId: fatherCommentId,
            grandCommentId: grandCommentId,
        }
        axios.post(`${api_video_comment}/insert`, data)
            .then(response => {
                const resp = response.data;
                console.log("Reply response from server:", resp); // kiểm tra phản hồi từ server
                if (resp.success) {
                    // Lấy dữ liệu phản hồi mới từ server
                    const replyId = resp.comment_id; // get reply comment id return by server
                    let comment = {
                        id: replyId,
                        user: sessionUser,
                        father_comment_user: father_comment_user,
                        content: replyContent,
                        like_count: 0,
                        dislike_count: 0,
                        createdAt: new Date(),
                        child_count: 0
                    }
                    let newReply = renderComment(comment, 'reply', grandCommentId);

                    let replyContainer = document.getElementById(`replies-container-${grandCommentId}`);
                    replyContainer.insertBefore(newReply, replyContainer.firstChild);
                } else {
                    alert('Gửi phản hồi không thành công.');
                }
            })
            .catch(error => {
                console.error('Error submitting reply:', error);
                alert('Đã xảy ra lỗi khi gửi phản hồi.');
            });
    } else {
        alert('Vui lòng nhập nội dung phản hồi');
    }
}

// function submitReply(commentId) {
//     const replyInput = document.getElementById(`reply-section-${commentId}`).querySelector('input');
//     const replyContent = replyInput.value.trim();
//
//     if (replyContent) {
//         console.log("Sending reply content:", replyContent); // kiểm tra nội dung phản hồi
//
//         axios.post(`${api_video}/comment/reply`, {commentId: commentId, content: replyContent})
//             .then(response => {
//                 console.log("Reply response from server:", response.data); // kiểm tra phản hồi từ server
//                 if (response.data.success) {
//                     // Thêm phản hồi vào danh sách phản hồi trên giao diện
//                     const commentItem = replyInput.closest('li');
//                     let replyList = commentItem.querySelector('ul');
//
//                     if (!replyList) {
//                         replyList = document.createElement('ul');
//                         replyList.classList.add('mt-2');
//                         commentItem.appendChild(replyList);
//                     }
//
//                     // Tạo phần tử phản hồi mới
//                     const newReply = document.createElement('li');
//                     newReply.classList.add('mb-1');
//                     newReply.innerHTML = `<strong>${sessionUser.name}:</strong> ${replyContent}`;
//                     replyList.appendChild(newReply);
//
//                     // Xóa nội dung trong ô nhập
//                     replyInput.value = '';
//                 }
//             })
//             .catch(error => console.error('Error submitting reply:', error));
//     } else {
//         alert('Vui lòng nhập nội dung phản hồi');
//     }
// }

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* Like comment */
function likeComment(commentId) {
    axios.post(`${api_video_comment}/like`, {commentId: commentId})
        .then(response => {
            if (response.data.success) {
                // Tìm và cập nhật số lượt like
                const likeButton = document.querySelector(`[onclick="likeComment('${commentId}')"]`);
                let likeCount = parseInt(likeButton.textContent.trim());
                likeButton.innerHTML = `<i class="bi bi-hand-thumbs-up-fill"></i> ${likeCount + 1}`;
            }
        })
        .catch(error => console.error('Error liking the comment:', error));
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* Dislike comment */
function dislikeComment(commentId) {
    axios.post(`${api_video_comment}/dislike`, {commentId: commentId})
        .then(response => {
            if (response.data.success) {
                // Tìm và cập nhật số lượt dislike
                const dislikeButton = document.querySelector(`[onclick="dislikeComment('${commentId}')"]`);
                let dislikeCount = parseInt(dislikeButton.textContent.trim());
                dislikeButton.innerHTML = `<i class="bi bi-hand-thumbs-down-fill"></i> ${dislikeCount + 1}`;
            }
        })
        .catch(error => console.error('Error disliking the comment:', error));
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* Edit Comment */
function editComment(commentId) {
    console.log('editComment called with commentId:', commentId);

    const commentItem = document.querySelector(`[data-comment-id="${commentId}"]`);
    const comment_content_element = commentItem.querySelector('div.d-flex.align-items-center').querySelector('div.flex-grow-1');
    const comment_content = comment_content_element.querySelector('p.mb-1');

    // Nếu đã có ô nhập liệu, không tạo thêm
    if (commentItem.querySelector('.edit-input')) return;

    // Tạo ô nhập liệu và điền nội dung hiện tại
    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.classList.add('form-control', 'edit-input');
    editInput.value = comment_content.innerText;

    const saveButton = document.createElement('button');
    saveButton.classList.add('btn', 'btn-success', 'btn-sm', 'mt-1', 'me-2');
    saveButton.innerText = 'Lưu';
    const cancelButton = document.createElement('button');
    cancelButton.classList.add('btn', 'btn-secondary', 'btn-sm', 'mt-1');
    cancelButton.innerText = 'Hủy';
    const actionContainer = commentItem.querySelector('.d-flex.align-items-center.mt-1');
    actionContainer.innerHTML = '';
    actionContainer.appendChild(saveButton);
    actionContainer.appendChild(cancelButton);

    // Tạo nút lưu

    saveButton.onclick = () => saveEditedComment(
        commentId,
        editInput.value,
        comment_content_element,
        editInput,
        comment_content,
        actionContainer,
        saveButton,
        cancelButton
    );
    // Tạo nút hủy
    comment_content_element.replaceChild(editInput, comment_content);
    cancelButton.onclick = () => cancelEditComment(
        commentId,
        comment_content.innerText,
        comment_content_element,
        editInput,
        comment_content,
        actionContainer,
        saveButton,
        cancelButton);
    // Thay thế nội dung bình luận bằng ô nhập liệu và các nút
}

/* Cancel Edit Comment */
function cancelEditComment(commentId) {
    const commentItem = document.querySelector(`[data-comment-id="${commentId}"]`);
    const editInput = commentItem.querySelector('.edit-input');

    // Lấy lại nội dung gốc từ thuộc tính data
    const originalContent = editInput.defaultValue;

    // Tạo phần tử <p> mới với nội dung gốc
    const originalCommentContent = document.createElement('p');
    originalCommentContent.classList.add('mb-1');
    originalCommentContent.innerText = originalContent;

    // Thay thế trường nhập liệu bằng phần tử <p>
    commentItem.replaceChild(originalCommentContent, editInput);

    // Khôi phục các nút hành động ban đầu (like, dislike, reply)
    const actionContainer = commentItem.querySelector('.d-flex.align-items-center.mt-1');
    actionContainer.innerHTML = ''; // Xóa các nút hiện tại

    // Thêm lại các nút like, dislike, và reply
    const likeButton = document.createElement('button');
    likeButton.classList.add('icon-button', 'me-2', 'btn', 'btn-light', 'btn-sm');
    likeButton.onclick = () => likeComment(commentId);
    likeButton.innerHTML = `<i class="bi bi-hand-thumbs-up"></i> <span>${originalContent.like_count || 0}</span>`;
    actionContainer.appendChild(likeButton);

    const dislikeButton = document.createElement('button');
    dislikeButton.classList.add('icon-button', 'me-2', 'btn', 'btn-light', 'btn-sm');
    dislikeButton.onclick = () => dislikeComment(commentId);
    dislikeButton.innerHTML = `<i class="bi bi-hand-thumbs-down"></i> <span>${originalContent.dislike_count || 0}</span>`;
    actionContainer.appendChild(dislikeButton);

    const replyButton = document.createElement('button');
    replyButton.classList.add('icon-button', 'btn', 'btn-light', 'btn-sm');
    replyButton.onclick = () => toggleReplySection(commentId);
    replyButton.innerHTML = `<i class="bi bi-reply"></i> Phản hồi`;
    actionContainer.appendChild(replyButton);
}


/* Save Edited Comment */
function saveEditedComment(commentId,
                           newContent,
                           comment_content_element,
                           editInput,
                           comment_content,
                           actionContainer,
                           saveButton,
                           cancelButton) {
    comment_content.textContent = newContent;

    if (newContent.trim() === "") {
        alert('Vui lòng không để trống bình luận.');
        return;
    }

    axios.put('/api/user/video/comment/edit', {commentId: commentId, content: newContent, videoId: videos[currentIndex].id})
        .then(response => {
            if (response.data.success) {
                comment_content_element.replaceChild(comment_content, editInput);
                actionContainer.removeChild(cancelButton);
                actionContainer.removeChild(saveButton);

            } else {
                alert('Chỉnh sửa bình luận không thành công.');
            }
        })
        .catch(error => {
            console.error('Error editing the comment:', error);
            alert('Đã xảy ra lỗi khi chỉnh sửa bình luận.');
        });
}

function deleteComment(commentId) {
    const videoId = videos[currentIndex].id;

    axios.post(`${api_video_comment}/delete`, {commentId: commentId, videoId: videoId})
        .then(response => {
            if (response.data.success) {
                // Xóa bình luận khỏi giao diện
                const commentItem = document.querySelector(`[data-comment-id="${commentId}"]`);
                if (commentItem) {
                    commentItem.remove();
                }

                // Cập nhật mảng comments trong videos[currentIndex]
                videos[currentIndex].comments = videos[currentIndex].comments.filter(comment => comment.id !== commentId);

                // Cập nhật số lượng bình luận hiển thị
                document.getElementById('comment-count').innerText = videos[currentIndex].comments.length;

                alert('Xóa bình luận thành công.');
            } else {
                alert('Xóa bình luận không thành công.');
            }
        })
        .catch(error => {
            console.error('Error deleting the comment:', error);
            alert('Đã xảy ra lỗi khi xóa bình luận.');
        });
}