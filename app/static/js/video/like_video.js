function likeWatchingVideo(video_id) {
    axios.post(`${api_video}/like`, {videoId: video_id, userId: sessionId})
       .then(response => {
            if (response.data.success) {
                const likeCountElement = document.getElementById("watching-video-like-count");
                let likeCount = parseInt(likeCountElement.textContent, 10);
                likeCount++;
                likeCountElement.textContent = likeCount;
            }
        })
       .catch(error => {
            console.error('Error liking video:', error);
        });
}
function watchingVideolikeComment(comment_id, video_id , button_element) {
    axios.post(`${api_video_comment}/like`, {
        commentId: comment_id,
        videoId: video_id,
        userId: sessionId
    })
        .then(response => {
            document.getElementById(`like-count-${comment_id}`).textContent = response.data.like_count + " likes";
            button_element.classList.add('active');
            button_element.innerHTML='<i class="bi bi-hand-thumbs-up-fill"></i>'
            button_element.onclick = () => watchingVideoDisLikeComment(comment_id, video_id, button_element);
        })
}
function watchingVideoDisLikeComment(comment_id, video_id , button_element) {
    axios.post(`${api_video_comment}/unlike`, {
        commentId: comment_id,
        videoId: video_id,
        userId: sessionId
    })
        .then(response => {
            document.getElementById(`like-count-${comment_id}`).textContent = response.data.like_count + " likes";
            button_element.classList.remove('active');
            button_element.innerHTML='<i class="bi bi-hand-thumbs-up"></i>'
            button_element.onclick = () => watchingVideolikeComment(comment_id, video_id, button_element);
        })
}