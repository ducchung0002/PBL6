// // Gắn sự kiện click cho nút "Gửi" trong phần bình luận
document.getElementById('send-comment').addEventListener('click', function () {
    if (!sessionUser || !sessionUser.id) {
        alert('Vui lòng đăng nhập để bình luận.');
        return;
    }

    const videoId = videos[currentIndex].id;
    const commentContent = document.getElementById('comment-input').value.trim();
    const userId = sessionUser.id;

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
                                    child_count: 0, // Quan trọng: child_count = 0 ban đầu
                                };

                                // 1) push comment cha vào videos[currentIndex].comments
                                videos[currentIndex].comments.push(newComment);

                                // 2) Tăng total_comments_count
                                videos[currentIndex].total_comments_count += 1;
                                document.getElementById('comment-count').innerText = videos[currentIndex].total_comments_count;

                                // 3) render lại
                                // renderCommentsForVideo(videos[currentIndex]);
                                renderNewCommentForVideo(videos[currentIndex], newComment);

                                // clear input
                                document.getElementById('comment-input').value = '';
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
