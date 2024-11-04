// Gắn sự kiện click cho nút "Gửi" trong phần bình luận
document.getElementById('send-comment').addEventListener('click', function () {
    if (!sessionUser || !sessionUser.id) {
        alert('Vui lòng đăng nhập để bình luận.');
        return;
    }

    const videoId = videos[currentIndex].id;
    const commentContent = document.getElementById('comment-input').value.trim();
    const userId = sessionUser.id;

    let data = {
        videoId: videoId, content: commentContent, userId: userId,
    };
    console.log('Sending comment data:', data);

    if (commentContent) {
        axios.post(`${api_video_comment}/insert`, data)
            .then(response => {
                console.log('Response from server:', response.data.comment_id);

                // Cập nhật video data và render lại các comment
                videos[currentIndex].comments.push({
                    id: response.data.comment_id,
                    user: sessionUser,
                    content: commentContent,
                    like_count: 0,
                    dislike_count: 0
                });

                renderCommentsForVideo(videos[currentIndex]);

                // Cập nhật số comment hiển thị cạnh video
                document.getElementById('comment-count').innerText = videos[currentIndex].comments.length;

                // Xóa nội dung trong ô nhập sau khi thêm bình luận
                document.getElementById('comment-input').value = '';
            })
            .catch(error => {
                console.error('Error commenting on the video:', error);
                alert('Đã xảy ra lỗi khi gửi bình luận.');
            });
    } else {
        alert('Vui lòng nhập nội dung bình luận.');
    }
});