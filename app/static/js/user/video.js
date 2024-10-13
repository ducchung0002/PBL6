let videos = []; // To store the list of videos
let currentIndex = 0; // To keep track of the current video index

// Function to load a video by index
function loadVideo(index) {
    if (index >= 0 && index < videos.length) {
        const video = videos[index];
        const videoPlayer = document.getElementById('video-player');
        videoPlayer.src = video.video_url;
        // Update like and comment counts based on the loaded video
        document.getElementById('like-count').innerText = video.like_count;
        document.getElementById('comment-count').innerText = video.comments.length;
    }
}

// Fetch the list of videos from the API using Axios
function fetchVideos() {
    axios.get('/api/video/get')
        .then(response => {
            let videos = response.data;  // Axios automatically parses the response as JSON
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
    fetchVideos();
});


// Event listeners for navigation buttons
document.getElementById('prev-button').addEventListener('click', function () {
    if (currentIndex > 0) {
        currentIndex -= 1;
        loadVideo(currentIndex);
    }
});

document.getElementById('next-button').addEventListener('click', function () {
    if (currentIndex < videos.length - 1) {
        currentIndex += 1;
        loadVideo(currentIndex);
    }
});

// Event listener for mouse wheel scroll
window.addEventListener('wheel', function (event) {
    if (event.deltaY < 0) {
        // Scroll up
        if (currentIndex > 0) {
            currentIndex -= 1;
            loadVideo(currentIndex);
        }
    } else if (event.deltaY > 0) {
        // Scroll down
        if (currentIndex < videos.length - 1) {
            currentIndex += 1;
            loadVideo(currentIndex);
        }
    }
});

function video_like(userId) {
    console.log("video_like function called");
    console.log("userId: " + userId);

    const videoId = videos[currentIndex].id;

    axios.post('/api/video/like', {videoId: videoId, userId: userId})
        .then(response => {
            let rep = response.data;
            console.log(rep);
            if (rep.success) {
                // Update like count from API response
                const updatedLikeCount = response.data['like_count'];
                document.getElementById('like-count').innerText = updatedLikeCount;
                // Update the local video object with new like count
                videos[currentIndex].like_count = updatedLikeCount;
                // Change the like button color
                document.getElementById('like-button').backgroundColor = 'blue';
            }
        })
        .catch(error => console.error('Error liking the video:', error));
}

function toggleComment() {
    const commentSection = document.getElementById('comment-section');
    const videoSection = document.getElementById('video-player').parentElement;

    // Toggle hiển thị của phần comment
    if (commentSection.classList.contains('d-none')) {
        // Hiển thị comment section
        commentSection.classList.remove('d-none');
        commentSection.classList.add('d-block');
    } else {
        // Ẩn comment section
        commentSection.classList.remove('d-block');
        commentSection.classList.add('d-none');
    }

    // Đặt lại video chính giữa
    videoSection.scrollIntoView({behavior: 'smooth', block: 'center'});
}

// Comment button functionality
document.getElementById('send-comment').addEventListener('click', function () {
    const videoId = videos[currentIndex].id;
    commentContent = document.getElementById('comment-input').value;
    console.log('Comment content:', commentContent);
    if (commentContent) {
        axios.post(`/api/video/comment`, {videoID: videoId, comment: commentContent})
            .then(response => {
                // Update comment count from API response
                const updatedCommentCount = response.data.comment_count;
                document.getElementById('comment-count').innerText = updatedCommentCount;
                // Update the local video object with new comment count
                videos[currentIndex].comments.push({content: commentContent});
            })
            .catch(error => console.error('Error commenting on the video:', error));
    }
});

// Placeholder functionality for other buttons
document.getElementById('dislike-button').addEventListener('click', function () {
    alert('Dislike functionality not implemented yet');
});

document.getElementById('share-button').addEventListener('click', function () {
    alert('Share functionality not implemented yet');
});

document.getElementById('settings-button').addEventListener('click', function () {
    alert('Settings functionality not implemented yet');
});

// Initial call to fetch and load videos
fetchVideos();
