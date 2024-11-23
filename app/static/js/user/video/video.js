let videos = []; // To store the list of videos
let currentIndex = 0; // To keep track of the current video index
let api_video = '/api/user/video';
let api_video_comment = `${api_video}/comment`;

function loadVideo(index) {
    if (index >= 0 && index < videos.length) {
        const video = videos[index];
        const videoPlayer = document.getElementById('video-player');
        videoPlayer.src = video.video_url;

        // Cập nhật số lượt thích và bình luận
        document.getElementById('like-count').innerText = video.like_count;
        document.getElementById('comment-count').innerText = video.comments.length;

        // Hiển thị bình luận
        renderComments(video);

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

    // Gắn sự kiện click cho nút "Thông tin mô tả"
    document.getElementById('info-button-modal').addEventListener('click', function () {
        event.preventDefault(); // Ngăn chặn hành động mặc định của thẻ <a>
        toggleDescription();
        // Đóng modal sau khi nhấn
        // let settingsModal = bootstrap.Modal.getInstance(document.getElementById('settingsModal'));
    });

    // Gắn sự kiện click cho nút "X" để đóng phần mô tả
    document.getElementById('close-description').addEventListener('click', function () {
        const descriptionSection = document.getElementById('description-section');
        descriptionSection.classList.remove('d-block');
        descriptionSection.classList.add('d-none');
    });

    // Gắn sự kiện cho nút chia sẻ
    document.getElementById('shareModal').addEventListener('shown.bs.modal', function () {
        const currentUrl = window.location.href;
        document.getElementById('share-link').value = currentUrl;
    });
    // Sự kiện cho nút "Lưu vào danh sách phát"
    document.getElementById('save-to-playlist-button').addEventListener('click', function (event) {
        event.preventDefault(); // Ngăn chặn hành động mặc định

        // Đóng modal "Cài đặt"
        let settingsModal = bootstrap.Modal.getInstance(document.getElementById('settingsModal'));
        settingsModal.hide();

        // Mở modal "Lưu vào danh sách phát" sau khi modal "Cài đặt" đã đóng
        settingsModal._element.addEventListener('hidden.bs.modal', function () {
            let saveToPlaylistModal = new bootstrap.Modal(document.getElementById('saveToPlaylistModal'));
            saveToPlaylistModal.show();
        }, { once: true });
    });

    // Gắn sự kiện click cho nút "Phụ đề"
    document.getElementById('subtitle-button').addEventListener('click', function () {
        // Đóng modal "Cài đặt" sau khi nhấn
        let settingsModal = bootstrap.Modal.getInstance(document.getElementById('settingsModal'));
        settingsModal.hide();

        // Hiển thị modal thông báo
        let subtitleModal = new bootstrap.Modal(document.getElementById('subtitleModal'));
        subtitleModal.show();
    });
    // Gắn sự kiện click cho nút "Gửi" trong phần bình luận
    document.getElementById('send-comment').addEventListener('click', function () {
        if (!sessionUser || !sessionUser.id ) {
            alert('Vui lòng đăng nhập để bình luận.');
            return;
        }

        const videoId = videos[currentIndex].id;
        const commentContent = document.getElementById('comment-input').value.trim();
        const userId = sessionUser.id;

        let data = {videoId: videoId, content: commentContent, userId: userId}
        console.log('Sending comment data:', data);

        if (commentContent) {
            axios.post(`${api_video_comment}/insert`, data)
                .then(response => {
                    console.log('Response from server:', response.data.comment_id);

                    // Cập nhật video data và render lại các comment
                    videos[currentIndex].comments.push({
                        id: response.data.comment_id,
                        user: {name: sessionUser.name},
                        content: response.data.new_comment['content'],
                        // content: commentContent,
                        like_count: 0,
                        dislike_count: 0
                    });

                    renderComments(videos[currentIndex]);

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
    document.getElementById('submitReportButton').addEventListener('click', function () {
        // Lấy lý do vi phạm đã chọn
        const selectedReason = document.querySelector('input[name="violationReason"]:checked');
        if (selectedReason) {
            // Hiển thị thông báo xác nhận
            document.getElementById('reportConfirmation').classList.remove('d-none');
            document.getElementById('reportConfirmation').classList.add('d-block');
            document.getElementById('selectedReason').innerText = selectedReason.value;

            // Ẩn form lựa chọn lý do vi phạm
            document.getElementById('reportForm').querySelectorAll('div.mb-3')[0].classList.add('d-none');

            // Ẩn nút "Báo vi phạm" và "Huỷ"
            document.querySelector('#reportModal .modal-footer').classList.add('d-none');

        } else {
            alert('Vui lòng chọn một lý do vi phạm.');
        }
    });
    // Khi modal "Báo vi phạm" bị ẩn, đặt lại trạng thái
    document.getElementById('reportModal').addEventListener('hidden.bs.modal', function () {
        // Đặt lại form
        document.getElementById('reportForm').reset();
        // Hiển thị lại form lựa chọn lý do vi phạm
        document.getElementById('reportForm').querySelectorAll('div.mb-3')[0].classList.remove('d-none');
        // Ẩn phần xác nhận
        document.getElementById('reportConfirmation').classList.remove('d-block');
        document.getElementById('reportConfirmation').classList.add('d-none');
        // Hiển thị lại footer
        document.querySelector('#reportModal .modal-footer').classList.remove('d-none');
    });
    document.getElementById('feedback-button').addEventListener('click', function () {
        // Hiển thị bảng phản hồi
        document.getElementById('feedback-section').classList.remove('d-none');
        document.getElementById('feedback-section').classList.add('d-block');

        // Đóng modal "Cài đặt" sau khi nhấn
        let settingsModal = bootstrap.Modal.getInstance(document.getElementById('settingsModal'));
        settingsModal.hide();
    });
    document.getElementById('close-feedback').addEventListener('click', function () {
        // Ẩn bảng phản hồi
        document.getElementById('feedback-section').classList.remove('d-block');
        document.getElementById('feedback-section').classList.add('d-none');

        // Đặt lại nội dung
        resetFeedbackForm();
    });
    document.getElementById('send-feedback-button').addEventListener('click', function () {
        const feedbackText = document.getElementById('feedback-text').value.trim();

        if (feedbackText) {
            // Hiển thị thông báo cảm ơn
            document.getElementById('feedback-thank-you').classList.remove('d-none');

            // Ẩn các thành phần khác
            document.getElementById('feedback-text').disabled = true;
            document.getElementById('screenshot-button').disabled = true;
            document.getElementById('send-feedback-button').disabled = true;

        } else {
            alert('Vui lòng nhập nội dung phản hồi.');
        }
    });
    function resetFeedbackForm() {
        document.getElementById('feedback-text').value = '';
        document.getElementById('feedback-text').disabled = false;
        document.getElementById('screenshot-button').disabled = false;
        document.getElementById('send-feedback-button').disabled = false;
        document.getElementById('feedback-thank-you').classList.add('d-none');
    }
    document.getElementById('screenshot-button').addEventListener('click', function () {
        html2canvas(document.body).then(function (canvas) {
            // Chuyển đổi canvas thành hình ảnh dạng data URL
            const imgData = canvas.toDataURL('image/png');

            // Lưu trữ hoặc gửi hình ảnh này đến server nếu cần
            // Ví dụ: hiển thị hình ảnh trong bảng phản hồi
            const imgPreview = document.createElement('img');
            imgPreview.src = imgData;
            imgPreview.classList.add('img-fluid', 'mt-2');
            document.getElementById('feedback-section').appendChild(imgPreview);
        });
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
// window.addEventListener('wheel', function (event) {
//     if (event.deltaY < 0) {
//         // Scroll up
//         if (currentIndex > 0) {
//             currentIndex -= 1;
//             loadVideo(currentIndex);
//         }
//     } else if (event.deltaY > 0) {
//         // Scroll down
//         if (currentIndex < videos.length - 1) {
//             currentIndex += 1;
//             loadVideo(currentIndex);
//         }
//     }
// });

let liked = false; // Biến trạng thái like của người dùng
function video_like(userId) {
    const videoId = videos[currentIndex].id;

    if (liked) {
        // Người dùng muốn bỏ thích
        axios.post(`${api_video}/unlike`, {videoId: videoId, userId: userId})
            .then(response => {
                if (response.data.success) {
                    // Giảm số lượt thích
                    videos[currentIndex].like_count--;
                    document.getElementById('like-count').innerText = videos[currentIndex].like_count;

                    // Đổi lại màu về trạng thái chưa thích (trắng)
                    const likeButton = document.getElementById('like-button');
                    likeButton.style.backgroundColor = 'white';
                    likeButton.style.color = 'black';

                    // Đặt lại trạng thái liked
                    liked = false;
                }
            })
            .catch(error => console.error('Error unliking the video:', error));
    } else {
        // Người dùng muốn thích
        axios.post(`${api_video}/like`, {videoId: videoId, userId: userId})
            .then(response => {
                if (response.data.success) {
                    // Tăng số lượt thích
                    videos[currentIndex].like_count++;
                    document.getElementById('like-count').innerText = videos[currentIndex].like_count;

                    // Đổi màu khi thích (đen)
                    const likeButton = document.getElementById('like-button');
                    likeButton.style.backgroundColor = 'black';
                    likeButton.style.color = 'white';

                    // Đặt lại trạng thái liked
                    liked = true;
                }
            })
            .catch(error => console.error('Error liking the video:', error));
    }
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

// Placeholder functionality for other buttons
document.getElementById('dislike-button').addEventListener('click', function () {
    alert('Dislike functionality not implemented yet');
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* toggleDescription */
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
        document.getElementById('like-count-description').innerText = video.like_count || 0;
        document.getElementById('comment-count-description').innerText = video.comments.length || 0;
        document.getElementById('uploader').innerText = video.user.name || 'Người đăng';

    } else {
        // Ẩn mô tả
        descriptionSection.classList.remove('d-block');
        descriptionSection.classList.add('d-none');
    }

    // Đặt lại video chính giữa
    videoSection.scrollIntoView({behavior: 'smooth', block: 'center'});
}

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
document.getElementById('watchLaterPrivacy').addEventListener('click', function () {
    togglePrivacy(this);
});
document.getElementById('playlist1Privacy').addEventListener('click', function () {
    togglePrivacy(this);
});
document.getElementById('playlist2Privacy').addEventListener('click', function () {
    togglePrivacy(this);
});
document.getElementById('playlist3Privacy').addEventListener('click', function () {
    togglePrivacy(this);
});
document.getElementById('addNewPlaylist').addEventListener('click', function () {
    // Show the "Create New Playlist" modal when the "+ Danh sách phát mới" button is clicked
    let createPlaylistModal = new bootstrap.Modal(document.getElementById('createPlaylistModal'));
    createPlaylistModal.show();
});

document.getElementById('createPlaylistButton').addEventListener('click', function () {
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
            // console.log("Playlist created successfully:", response.data);
            // Đóng modal sau khi tạo thành công
            var createPlaylistModal = new bootstrap.Modal(document.getElementById('createPlaylistModal'));
            createPlaylistModal.hide();
        })
        .catch(error => {
            console.error('Error creating playlist:', error);
        });
});

// Event listener for "Không đề xuất kênh này"
document.getElementById('no-suggest-channel').addEventListener('click', function () {
    // Xử lý khi click vào "Không đề xuất kênh này"
    if (currentIndex < videos.length - 1) {
        currentIndex += 1;
        loadVideo(currentIndex);  // Gọi hàm để load video kế tiếp
        // Cuộn tới video kế tiếp
        const videoSection = document.getElementById('video-player').parentElement;
        videoSection.scrollIntoView({behavior: 'smooth', block: 'center'});
    } else {
        alert('Không có video tiếp theo.');
    }
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

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* Thêm sự kiện vào phần tử cha sau khi render comments */
// function addDropdownEventListeners() {
//     const commentList = document.getElementById('comment-list');
//
//     // Lắng nghe sự kiện click cho phần tử cha chứa bình luận
//     commentList.addEventListener('click', function (event) {
//         // Kiểm tra nếu phần tử được click là nút ba chấm hoặc bên trong nó
//         if (event.target && (event.target.matches('.dropdown-toggle') || event.target.closest('.dropdown-toggle'))) {
//             event.preventDefault(); // Ngăn chặn hành động mặc định
//             event.stopPropagation(); // Ngăn chặn sự kiện lan tỏa
//
//             // Đóng các dropdown khác trước khi mở dropdown hiện tại
//             document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
//                 menu.classList.remove('show');
//             });
//
//             // Lấy phần tử dropdown hiện tại và toggle lớp "show"
//             const dropdownMenu = event.target.closest('.dropdown').querySelector('.dropdown-menu');
//             dropdownMenu.classList.toggle('show');
//         }
//
//         // Kiểm tra nếu người dùng click ra ngoài menu để đóng
//         if (!event.target.closest('.dropdown')) {
//             document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
//                 menu.classList.remove('show');
//             });
//         }
//     });
//
//     // Đóng menu khi click ra ngoài (document)
//     document.addEventListener('click', function (e) {
//         if (!e.target.closest('.dropdown-menu') && !e.target.closest('.dropdown-toggle')) {
//             document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
//                 menu.classList.remove('show');
//             });
//         }
//     });
// }

/* Render Comment */
function renderComments(video) {
    const commentList = document.getElementById('comment-list');
    commentList.innerHTML = ''; // Xóa các bình luận cũ

    video.comments.forEach(comment => {
        const li = document.createElement('li');
        li.classList.add('mb-3', 'd-flex', 'flex-column');
        li.setAttribute('data-comment-id', comment.id); // Thêm thuộc tính data-comment-id

        // Phần chứa avatar, tên người dùng và nội dung bình luận
        const commentContentDiv = document.createElement('div');
        commentContentDiv.classList.add('d-flex', 'align-items-center');
        // console.log(comment.user.id);
        // Thêm avatar
        const avatar = document.createElement('img');
        avatar.src = comment.user.avatar_url || '/path/to/default/avatar.png';
        avatar.alt = 'User Avatar';
        avatar.classList.add('rounded-circle', 'me-2');
        avatar.style.width = '32px';
        avatar.style.height = '32px';
        commentContentDiv.appendChild(avatar);

        // Thêm tên người dùng và nội dung bình luận
        const commentDetails = document.createElement('div');
        commentDetails.classList.add('flex-grow-1');

        const userName = document.createElement('strong');
        userName.innerText = `${comment.user.name}`;
        commentDetails.appendChild(userName);

        const commentContent = document.createElement('p');
        commentContent.classList.add('mb-1');
        commentContent.innerText = comment.content;
        commentDetails.appendChild(commentContent);

        commentContentDiv.appendChild(commentDetails);

        // Nút menu ba chấm (Dropdown)

        const dropdownDiv = document.createElement('div');
        dropdownDiv.classList.add('dropdown');


        const dropdownButton = document.createElement('button');
        // dropdownButton.classList.add('btn', 'btn-link', 'dropdown-toggle', 'text-decoration-none', 'text-muted', 'p-0');
        dropdownButton.classList.add('btn', 'dropdown-toggle');
        dropdownButton.setAttribute('type', 'button');
        dropdownButton.setAttribute('data-bs-toggle', 'dropdown');
        dropdownButton.setAttribute('aria-expanded', 'false');
        // dropdownButton.setAttribute('data-bs-display', 'static');
        // dropdownButton.setAttribute('data-bs-container', 'body');
        // dropdownButton.setAttribute('data-bs-boundary', 'viewport');
        dropdownButton.setAttribute('data-toggle', 'dropdown');


        dropdownButton.innerHTML = '<i class="bi bi-three-dots-vertical"></i>';
        dropdownDiv.appendChild(dropdownButton);

        const dropdownMenu = document.createElement('ul');
        dropdownMenu.classList.add('dropdown-menu');

        if (sessionUser.id === comment.user.id) {
            console.log('User is the owner of the comment');
            // Mục "Chỉnh sửa"
            // Tạo phần tử "Chỉnh sửa" cho menu

            // Mục "Chỉnh sửa"
            // Trong phần tạo mục "Chỉnh sửa"
            const editItem = document.createElement('li');
            const editButton = document.createElement('button');
            editButton.classList.add('dropdown-item', 'd-flex', 'align-items-center');
            editButton.innerHTML = '<i class="bi bi-pencil me-2"></i> Chỉnh sửa';
            editButton.onclick = function (e) {
                e.preventDefault();
                e.stopPropagation();
                editComment(comment.id);
            };
            editItem.appendChild(editButton);
            dropdownMenu.appendChild(editItem);


            // Mục "Xóa"
            const deleteItem = document.createElement('li');
            const deleteButton = document.createElement('button');
            deleteButton.classList.add('dropdown-item', 'd-flex', 'align-items-center', 'text-danger');
            deleteButton.innerHTML = '<i class="bi bi-trash me-2"></i> Xóa bình luận';
            deleteButton.onclick = function (e) {
                e.preventDefault();
                e.stopPropagation();
                deleteComment(comment.id);
            };
            deleteItem.appendChild(deleteButton);
            dropdownMenu.appendChild(deleteItem);

        }
        else {
            // Mục "Report" cho bình luận của người khác
            const reportItem = document.createElement('li');
            const reportButton = document.createElement('button');
            reportButton.classList.add('dropdown-item', 'd-flex', 'align-items-center');
            reportButton.innerHTML = '<i class="bi bi-flag me-2"></i> Report';
            reportButton.onclick = function (e) {
                e.preventDefault();
                e.stopPropagation();
                reportComment(comment.id);
            };
            reportItem.appendChild(reportButton);
            dropdownMenu.appendChild(reportItem);

        }

        // Thêm dòng này để thêm dropdownMenu vào dropdownDiv
        dropdownDiv.appendChild(dropdownMenu);

        // Thêm dropdownDiv vào phần tử chứa bình luận
        commentContentDiv.appendChild(dropdownDiv);
        new bootstrap.Dropdown(dropdownButton);

        li.appendChild(commentContentDiv);

        // Container cho các nút like, dislike, và phản hồi
        const actionContainer = document.createElement('div');
        actionContainer.classList.add('d-flex', 'align-items-center', 'mt-1');

        // Button Like
        const likeButton = document.createElement('button');
        likeButton.classList.add('icon-button', 'me-2', 'btn', 'btn-light', 'btn-sm');
        likeButton.onclick = () => likeComment(comment.id);
        likeButton.innerHTML = `<i class="bi bi-hand-thumbs-up"></i> <span>${comment.like_count || 0}</span>`;
        actionContainer.appendChild(likeButton);

        // Button Dislike
        const dislikeButton = document.createElement('button');
        dislikeButton.classList.add('icon-button', 'me-2', 'btn', 'btn-light', 'btn-sm');
        dislikeButton.onclick = () => dislikeComment(comment.id);
        dislikeButton.innerHTML = `<i class="bi bi-hand-thumbs-down"></i> <span>${comment.dislike_count || 0}</span>`;
        actionContainer.appendChild(dislikeButton);

        // Button Phản hồi
        const replyButton = document.createElement('button');
        replyButton.classList.add('icon-button', 'btn', 'btn-light', 'btn-sm');
        replyButton.onclick = () => toggleReplySection(comment.id);
        replyButton.innerHTML = `<i class="bi bi-reply"></i> Phản hồi`;
        actionContainer.appendChild(replyButton);

        li.appendChild(actionContainer);

        // Khu vực nhập phản hồi (ẩn ban đầu)
        const replySection = document.createElement('div');
        replySection.id = `reply-section-${comment.id}`;
        replySection.classList.add('d-none', 'mt-2');

        const replyInput = document.createElement('input');
        replyInput.type = 'text';
        replyInput.classList.add('form-control');
        replyInput.placeholder = 'Nhập phản hồi...';
        replySection.appendChild(replyInput);

        const replySubmitButton = document.createElement('button');
        replySubmitButton.classList.add('btn', 'btn-primary', 'btn-sm', 'mt-1');
        replySubmitButton.innerText = 'Gửi';
        replySubmitButton.onclick = () => submitReply(comment.id);
        replySection.appendChild(replySubmitButton);

        li.appendChild(replySection);

        commentList.appendChild(li);
    });

    // Khởi tạo tất cả các dropdown sau khi render các comment
    // const dropdownElements = document.querySelectorAll('.dropdown-toggle');
    // dropdownElements.forEach(dropdown => {
    //     new bootstrap.Dropdown(dropdown); // Khởi tạo dropdown với Bootstrap
    // });
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* Toggle Reply Section */
function toggleReplySection(commentId) {
    const replySection = document.getElementById(`reply-section-${commentId}`);
    replySection.classList.toggle('d-none');
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* Submit Reply */
function submitReply(commentId) {
    const replyInput = document.getElementById(`reply-section-${commentId}`).querySelector('input');
    const replyContent = replyInput.value.trim();

    if (replyContent) {
        console.log("Sending reply content:", replyContent); // kiểm tra nội dung phản hồi
        axios.post(`${api_video}/comment/reply`, {commentId: commentId, content: replyContent})
            .then(response => {
                console.log("Reply response from server:", response.data); // kiểm tra phản hồi từ server
                if (response.data.success) {
                    // Thêm phản hồi vào danh sách phản hồi trên giao diện
                    const commentItem = replyInput.closest('li');
                    let replyList = commentItem.querySelector('ul');

                    if (!replyList) {
                        replyList = document.createElement('ul');
                        replyList.classList.add('mt-2');
                        commentItem.appendChild(replyList);
                    }

                    // Tạo phần tử phản hồi mới
                    const newReply = document.createElement('li');
                    newReply.classList.add('mb-1');
                    newReply.innerHTML = `<strong>${sessionUser.name}:</strong> ${replyContent}`;
                    replyList.appendChild(newReply);

                    // Xóa nội dung trong ô nhập
                    replyInput.value = '';
                }
            })
            .catch(error => console.error('Error submitting reply:', error));
    } else {
        alert('Vui lòng nhập nội dung phản hồi');
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* Like comment */
function likeComment(commentId) {
    axios.post('/api/user/video/comment/like', {commentId: commentId})
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
    axios.post('/api/user/video/comment/dislike', {commentId: commentId})
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

/* Delete Comment */
// function deleteComment(commentId) {
//     axios.post('/api/user/video/comment/delete', {commentId: commentId})
//         .then(response => {
//             if (response.data.success) {
//                 const commentItem = document.querySelector(`[data-comment-id="${commentId}"]`);
//                 commentItem.remove();
//             } else {
//                 alert('Xóa bình luận không thành công.');
//             }
//         })
//         .catch(error => {
//             console.error('Error deleting the comment:', error);
//             alert('Đã xảy ra lỗi khi xóa bình luận.');
//         });
// }
function deleteComment(commentId) {
    const videoId = videos[currentIndex].id;

    axios.post('/api/user/video/comment/delete', { commentId: commentId, videoId: videoId })
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

// function showEditDelete(event) {
//     // Ngăn chặn hành vi mặc định
//     event.preventDefault();
//     event.stopPropagation(); // Ngăn sự kiện lan tỏa
//
//     // Đóng tất cả các menu dropdown khác
//     document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
//         menu.classList.remove('show');
//     });
//
//     // Hiển thị dropdown hiện tại
//     const dropdownMenu = event.target.closest('.dropdown').querySelector('.dropdown-menu');
//     dropdownMenu.classList.toggle('show');
// }

// // Ẩn dropdown khi click bên ngoài
// document.addEventListener('click', function (e) {
//     if (!e.target.closest('.dropdown')) {
//         document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
//             menu.classList.remove('show');
//         });
//     }
// })
