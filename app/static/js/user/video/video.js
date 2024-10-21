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
            videos = response.data;
            console.log('Fetched videos:', videos);
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

    // Gắn sự kiện click cho nút "Thông tin mô tả"
    document.getElementById('info-button').addEventListener('click', function () {
        toggleDescription();
    });

    // Gắn sự kiện click cho nút "X" để đóng phần mô tả
    document.getElementById('close-description').addEventListener('click', function () {
        console.log("Đã nhấn nút X"); // Dòng log này để kiểm tra nếu sự kiện click có hoạt động hay không
        const descriptionSection = document.getElementById('description-section');
        descriptionSection.classList.remove('d-block');
        descriptionSection.classList.add('d-none');
    });
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
        axios.post('/api/video/comment', {videoID: videoId, comment: commentContent})
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

// document.getElementById('share-button').addEventListener('click', function () {
//     alert('Share functionality not implemented yet');
// });

// document.getElementById('settings-button').addEventListener('click', function () {
//     alert('Settings functionality not implemented yet');
// });

$(document).ready(function() {
    fetchVideos();  // Call your function here
});

function toggleDescription() {
    const descriptionSection = document.getElementById('description-section');
    const videoSection = document.getElementById('video-player').parentElement;

    // Toggle hiển thị của phần mô tả
    if (descriptionSection.classList.contains('d-none')) {
        // Hiển thị mô tả
        descriptionSection.classList.remove('d-none');
        descriptionSection.classList.add('d-block');

        // Cập nhật dữ liệu vào phần mô tả
        const video = videos[currentIndex];
        document.getElementById('video-title').innerText = video.music.title; // Hoặc video.title nếu bạn có trường này
        document.getElementById('like-count-description').innerText = video.like_count;
        document.getElementById('comment-count-description').innerText = video.comment_count;
        document.getElementById('uploader').innerText = video.user.name;
        document.getElementById('score-description').innerText = video.score;  // Cập nhật điểm số
    } else {
        // Ẩn mô tả
        descriptionSection.classList.remove('d-block');
        descriptionSection.classList.add('d-none');
    }

    // Đặt lại video chính giữa
    videoSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
// Function to toggle between Public and Private icons
// function togglePrivacy(button, playlistId) {
//     const icon = button.querySelector('i');
//     let newPrivacy = ''; // Sử dụng biến này để lưu trạng thái công khai/riêng tư
//
//     if (icon.classList.contains('bi-globe')) {
//         icon.classList.remove('bi-globe');
//         icon.classList.add('bi-lock-fill');
//         newPrivacy = 'private';  // Đặt trạng thái riêng tư
//     } else {
//         icon.classList.remove('bi-lock-fill');
//         icon.classList.add('bi-globe');
//         newPrivacy = 'public';  // Đặt trạng thái công khai
//     }
//
//     // Gửi request lưu trạng thái về server (API giả định)
//     axios.post('/api/playlist/update-privacy', {
//         playlistId: playlistId,
//         privacy: newPrivacy
//     })
//         .then(response => {
//             console.log('Privacy updated successfully:', response.data);
//         })
//         .catch(error => {
//             console.error('Error updating privacy:', error);
//         });
// }
// Function to toggle between Public and Private icons
// Function to toggle between Public and Private icons
function togglePrivacy(button) {
    const icon = button.querySelector('i');
    if (icon.classList.contains('bi-globe')) {
        icon.classList.remove('bi-globe');
        icon.classList.add('bi-lock-fill'); // Thay đổi thành icon ổ khóa
    } else {
        icon.classList.remove('bi-lock-fill');
        icon.classList.add('bi-globe'); // Thay đổi thành icon trái đất
    }
}

// Add event listeners for the privacy buttons
document.getElementById('watchLaterPrivacy').addEventListener('click', function() {
    togglePrivacy(this);
});
document.getElementById('playlist1Privacy').addEventListener('click', function() {
    togglePrivacy(this);
});
document.getElementById('playlist2Privacy').addEventListener('click', function() {
    togglePrivacy(this);
});
document.getElementById('playlist3Privacy').addEventListener('click', function() {
    togglePrivacy(this);
});
document.getElementById('addNewPlaylist').addEventListener('click', function() {
    // Show the "Create New Playlist" modal when the "+ Danh sách phát mới" button is clicked
    var createPlaylistModal = new bootstrap.Modal(document.getElementById('createPlaylistModal'));
    createPlaylistModal.show();
});

document.getElementById('createPlaylistButton').addEventListener('click', function() {
    // Handle the logic to create the playlist when the "Tạo" button is clicked
    const playlistTitle = document.getElementById('playlistTitle').value;
    const privacySetting = document.getElementById('privacySelect').value;

    if (playlistTitle.trim() === "") {
        alert("Vui lòng nhập tiêu đề cho danh sách phát");
        return;
    }

    // Gửi thông tin playlist tới server để lưu
    axios.post('/api/playlist/create', {
        title: playlistTitle,
        privacy: privacySetting
    })
        .then(response => {
            console.log("Playlist created successfully:", response.data);
            // Đóng modal sau khi tạo thành công
            var createPlaylistModal = new bootstrap.Modal(document.getElementById('createPlaylistModal'));
            createPlaylistModal.hide();
        })
        .catch(error => {
            console.error('Error creating playlist:', error);
        });
});
// Event listener for "Không đề xuất kênh này"
document.getElementById('no-suggest-channel').addEventListener('click', function() {
    // Xử lý khi click vào "Không đề xuất kênh này"
    if (currentIndex < videos.length - 1) {
        currentIndex += 1;
        loadVideo(currentIndex);  // Gọi hàm để load video kế tiếp
        // Cuộn tới video kế tiếp
        const videoSection = document.getElementById('video-player').parentElement;
        videoSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
        alert('Không có video tiếp theo.');
    }
});
//button chia sẻ
document.getElementById('share-button').addEventListener('click', function () {
    var shareModal = new bootstrap.Modal(document.getElementById('shareModal'));
    shareModal.show();

    // Cập nhật link hiện tại vào ô link chia sẻ
    const currentUrl = window.location.href;
    document.getElementById('share-link').value = currentUrl;
});
document.getElementById('copy-button').addEventListener('click', function () {
    const shareLinkInput = document.getElementById('share-link');
    shareLinkInput.select();
    shareLinkInput.setSelectionRange(0, 99999); // Đối với các thiết bị di động
    document.execCommand('copy');

    alert('Đường link đã được sao chép: ' + shareLinkInput.value);
});
document.getElementById('prev-icon').addEventListener('click', function () {
    const container = document.getElementById('social-icons');
    container.scrollBy({
        left: -100,  // Trượt sang trái 100px
        behavior: 'smooth'
    });
});

document.getElementById('next-icon').addEventListener('click', function () {
    const container = document.getElementById('social-icons');
    container.scrollBy({
        left: 100,  // Trượt sang phải 100px
        behavior: 'smooth'
    });
});