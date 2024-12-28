function handleClick(element) {
    element.classList.toggle('clicked');
    setTimeout(() => {
        element.classList.remove('clicked');
    }, 500);
    const wrapper = element.closest('.circle-wrapper');
    const isActive = wrapper.classList.contains('active');
    document.querySelectorAll('.circle-wrapper.active').forEach((el) => {
        el.classList.remove('active');
    });
    if (!isActive) {
        wrapper.classList.add('active');
    }
}
document.addEventListener('click', function (e) {
    const isClickInside = e.target.closest('.circle-wrapper');
    if (!isClickInside) {
        document.querySelectorAll('.circle-wrapper.active').forEach((el) => {
            el.classList.remove('active');
        });
    }
});
function WatchingVideoEditComment(video_id, comment_id) {
    let commentSection = document.getElementById(`${comment_id}-body`);
    let initialComment = commentSection.innerText;
    commentSection.innerHTML = `<div class="input-container">
                            <input id="edit-${comment_id}" type="text" value="${initialComment}" required>
                            <label for="input" class="label">Nhập bình luận</label>
                            <div class="underline"></div>
                            <div class="button-group">
                                <button class="cancel cancel-edit"
                                data-comment-id="${comment_id}"
                                data-initial-comment="${initialComment}">Hủy</button>
                                <button class="submit submit-edit"
                                data-comment-id="${comment_id}"
                                data-video-id="${video_id}"
                                >Lưu</button>
                            </div>
                        </div>`
}

document.addEventListener('click', function (event) {
    if (event.target.classList.contains('cancel-edit')) {
        const commentId = event.target.getAttribute('data-comment-id');
        const initialComment = event.target.getAttribute('data-initial-comment');
        cancleEdit(commentId , initialComment);
    }
    if (event.target.classList.contains('submit-edit')) {
        const comment_id = event.target.getAttribute('data-comment-id');
        const video_id = event.target.getAttribute('data-video-id');
        const content = document.querySelector(`#edit-${comment_id}`).value
        saveEdit(video_id, comment_id, content);
    }
});

function cancleEdit(comment_id, initialComment) {
    let commentSection = document.getElementById(`${comment_id}-body`);
    commentSection.innerText = initialComment;
}
function saveEdit(video_id, comment_id, content) {
    axios.post(`${api_video_comment}/hate_detection`, { content: content })
        .then(response => {
            if (response.data.success) {
                const detectionResult = response.data.content;
                if (hate_regex.test(detectionResult) === true) {
                    const violationModal = new bootstrap.Modal(document.getElementById('violationWarningModal'));
                    violationModal.show();
                } else {
                    axios.put(`${api_video_comment}/edit`, {
                        commentId: comment_id,
                        content: content,
                        videoId: video_id
                    }).then(response => {
                        if (response.data.success) {
                            let commentSection = document.getElementById(`${comment_id}-body`);
                            commentSection.innerText = content;
                        } else {
                            alert('Đã xảy ra lỗi khi cập nhật bình luận.');
                            let commentSection = document.getElementById(`${comment_id}-body`);
                            commentSection.innerHTML = `<div class="input-container">
                                            <input id="edit-${comment_id}" type="text" required="">
                                            <label for="input" class="label">Nhập bình luận</label>
                                            <div class="underline"></div>
                                            <div class="button-group">
                                                <button class="cancel cancel-edit"
                                                data-comment-id="${comment_id}"
                                                data-initial-comment="${initialComment}">Hủy</button>
                                                <button class="submit submit-edit"
                                                data-comment-id="${comment_id}"
                                                data-video-id="${video_id}"
                                                >Lưu</button>
                                            </div>
                                        </div>`
                            commentSection.querySelector(`#edit-${comment_id}`).value = content
                        }
                    })
                }
            }
        })
}
function WatchingVideoDeleteComment(video_id, comment_id) {
    axios.post(`${api_video_comment}/delete`, {commentId: comment_id, videoId: video_id})
        .then(response => {
            if (response.data.success) {
                const comments = document.getElementById('comments');
                let comment = document.querySelector(`[data-comment-id="${comment_id}"]`);
                comments.removeChild(comment)
                alert('Xóa bình luận thành công!');
            }else{
                alert('Đã xảy ra lỗi khi xóa bình luận.');
            }
    })
}