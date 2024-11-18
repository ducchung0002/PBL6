$(document).ready(function() {
    $('#update-artist-avatar').on('change', function(event) {
        const input = event.target;
        if (input.files && input.files[0]) {
            const file = input.files[0];
            const validImageTypes = ['image/jpeg', 'image/png'];
            if ($.inArray(file.type, validImageTypes) < 0) {
                alert('Please select a valid image file (JPEG, PNG).');
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
    axios.put('/api/artist/profile/', data)
        .then(function (response) {
            location.reload();
            alert('Profile updated successfully!');
        })
        .catch(function (error) {
            console.error('Error updating profile:', error);
            alert('Error updating profile. Please try again.');
        });
}




