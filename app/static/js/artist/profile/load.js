var shared_data = {
    following_data: null,
    follower_data: null,
    artist:null,
    session_user: null,
};
document.addEventListener('DOMContentLoaded', function () {
    fetchFollowData()
        .then((data) => {
            shared_data['follower_data'] = data.follower_data;
            shared_data['following_data'] = data.following_data;
            shared_data['artist'] = artist;
            shared_data['session_user'] = session_user;
        })
        .catch((error) => {
            console.error('Error fetching follow data:', error);
        });
    const editButtons = document.querySelectorAll('.edit-btn');
    editButtons.forEach(function (button){
        button.addEventListener('click', function (event) {
            // Get the genre values from the button's data attributes
            const artistId = this.getAttribute('data-id');
            const artistName = this.getAttribute('data-name');
            const artistUsername = this.getAttribute('data-username')
            const artistNickname = this.getAttribute('data-nickname');
            const artistDateOfBirth = this.getAttribute('data-dob');
            const artistEmail = this.getAttribute('data-email');
            const artistAvatar = this.getAttribute('data-avt');
            // Now populate the modal's form fields
            const editProfileModal = document.querySelector('#artist-edit-popup');
            editProfileModal.querySelector('#update-artist-id').value = artistId;
            editProfileModal.querySelector('#update-artist-name').value = artistName;
            editProfileModal.querySelector('#update-artist-username').value = artistUsername;
            editProfileModal.querySelector('#update-artist-dob').value = artistDateOfBirth;
            editProfileModal.querySelector('#update-artist-email').value = artistEmail;
            editProfileModal.querySelector('#update-artist-avatar').value = artistAvatar;
            editProfileModal.querySelector('#update-artist-nickname').value = artistNickname;
        });
    })
    const tabLinks = document.querySelectorAll('.tab-link');
    const underline = document.querySelector('.underline');

    function moveUnderline(activeTab) {
        underline.style.width = `${activeTab.offsetWidth}px`;
        underline.style.left = `${activeTab.offsetLeft}px`;
    }

    tabLinks.forEach(link => {
        if (link.href === window.location.href) {
            link.classList.add('active');
            underline.classList.add('active');
            moveUnderline(link);
        }
    });

    function fetchFollowData() {
        return Promise.all([
            axios.post('/api/user/follow/follower', {
                user_id: artist.id,
            }),
            axios.post('/api/user/follow/following', {
                user_id: artist.id,
            }),
        ])
            .then(([followerResponse, followingResponse]) => {
                return {
                    follower_data: followerResponse.data,
                    following_data: followingResponse.data,
                };
            });
    }
});
function createFollow(event){
    event.preventDefault();
    const followingId = $('#following-id').val();
    axios.post('/api/user/follow/create', {
        follower_id: session_user.id,
        following_id: followingId,
    })
        .then(function (response) {
            let button = event.target;
            button.onclick = deleteFollow;
            button.innerText = 'Hủy theo dõi';
            const follower_count = document.getElementById('follower_count');
            follower_count.innerText = parseInt(follower_count.innerText) + 1;
            alert('Theo dõi thành công');
        })
        .catch(function (error) {
            console.error('Follow Error', error);
            alert('Lỗi theo dõi');
        });
}
function deleteFollow(event)
{
    event.preventDefault(event);
    const followingId = $('#following-id').val();
    axios.delete('/api/user/follow/delete', {
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            follower_id: session_user.id,
            following_id: followingId,
        }
    })
        .then(function (response) {
            let button = event.target;
            button.onclick = createFollow;
            button.innerText = 'Theo dõi';
            const follower_count = document.getElementById('follower_count');
            follower_count.innerText = parseInt(follower_count.innerText) - 1;
            alert('Hủy theo dõi thành công');
        })
        .catch(function (error) {
            console.error('Follow Error', error);
            alert('Lỗi theo dõi');
        });
}