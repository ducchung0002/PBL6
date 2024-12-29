function updateArtist(event) {
    event.preventDefault(); // Prevent the form from submitting normally

    // Get the values from the form
    const artistId = $('#update-artist-id').val();
    const artistName = $('#update-artist-name').val();
    const artistUsername = $('#update-artist-username').val();
    const artistEmail = $('#update-artist-email').val();
    let artistPassword = $('#update-artist-password').val();
    if (artistPassword === '') {
        artistPassword = '123456';
    }
    const artistDateOfBirth = $('#update-artist-dob').val();
    if (dobValidate(artistDateOfBirth)) {
        const data = {
            id: artistId,
            name: artistName,
            username: artistUsername,
            email: artistEmail,
            password: artistPassword,
            date_of_birth: artistDateOfBirth
        };

        // Make the API call using Axios
        axios.put('/api/admin/artist/update', data)
            .then(function (response) {
                location.reload();
            })
            .catch(function (error) {
                console.error('Error updating artist:', error);
                alert('Lỗi cập nhật ca sĩ. Vui lòng thử lại.');
            });
    }
}