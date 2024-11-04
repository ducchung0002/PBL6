function loadVideo(index) {
    if (index >= 0 && index < videos.length) {
        const video = videos[index];
        const videoPlayer = document.getElementById('video-player');
        videoPlayer.src = video.video_url;

        // Cập nhật số lượt thích và bình luận
        document.getElementById('like-count').innerText = video.like_count;
        document.getElementById('comment-count').innerText = video.comments.length;

        // Hiển thị bình luận
        renderCommentsForVideo(video);

        // Cập nhật trạng thái liked và thay đổi màu nút like
        // console.log('video: ', video);
        liked = video.liked;
        const likeButton = document.getElementById('like-button');
        if (liked) {
            likeButton.style.backgroundColor = 'black';
            likeButton.style.color = 'white';
        } else {
            likeButton.style.backgroundColor = 'white';
            likeButton.style.color = 'black';
        }
    }
}
// Fetch the list of videos from the API using Axios
function fetchVideos() {
    axios.post(`${api_video}/get`, {userId: sessionUser.id})
        .then(response => {
            // console.log(response.data);

            videos = response.data;
            if (videos.length > 0) {
                loadVideo(0);  // Load the first video initially
            }
        })
        .catch(error => {
            console.error('Error fetching videos:', error);
        });
}

// Gọi hàm fetchVideos khi trang được load
document.addEventListener('DOMContentLoaded', function () {
    // Gọi dữ liệu video
    fetchVideos();
});


