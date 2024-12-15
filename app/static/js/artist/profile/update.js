$(document).ready(function() {
    $('#update-artist-avatar').on('change', function(event) {
        const input = event.target;
        if (input.files && input.files[0]) {
            const file = input.files[0];
            const validImageTypes = ['image/jpeg', 'image/png'];
            if ($.inArray(file.type, validImageTypes) < 0) {
                alert('Vui lòng chọn định dạng ảnh phù hợp (JPEG, PNG, GIF).');
                return;
            }
            const reader = new FileReader();
            reader.onload = function(e) {
                $('#artist-avatar').attr('src', e.target.result);
            };
            reader.readAsDataURL(file);
        }
    });
});
function updateProfile(event){
    event.preventDefault();
    const artistId = $('#update-artist-id').val();
    const name = $('#update-artist-name').val();
    const username = $('#update-artist-username').val();
    const email = $('#update-artist-email').val();
    const dob = $('#update-artist-dob').val();
    const bio = $('#update-artist-bio').val();
    const nickname = $('#update-artist-nickname').val();
    const avatar = $('#update-artist-avatar')[0];
    const data = new FormData();
    if(avatar.files && avatar.files[0]) {
        const file = avatar.files[0];
        data.append('image', file, `${username}-avatar.jpg`);
    }
    data.append('id', artistId);
    data.append('name', name);
    data.append('username', username);
    data.append('email', email);
    data.append('date_of_birth', dob);
    data.append('bio', bio);
    data.append('nickname', nickname);
    axios.put('/api/artist/profile/update', data)
        .then(function (response) {
            deactivateModal('artist-edit-popup');
            alert('Cập nhật hồ sơ thành công');
        })
        .catch(function (error) {
            console.error('Error updating profile:', error);
            alert('Lỗi cập nhật hồ sơ. Vui lòng thử lại.');
        });
}