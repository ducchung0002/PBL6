function addArtist(event) {
    event.preventDefault(); // Prevent the form from submitting normally
    const artistId = $('#artist-id').val();
    const artistName = $('#artist-name').val();
    const artistUsername = $('#artist-username').val();
    const artistEmail = $('#artist-email').val();
    const artistPassword = $('#artist-password').val();
    const artistDateOfBirth = $('#artist-dob').val();
    if (dobValidate(artistDateOfBirth)) {
        const data = {
            id: artistId,
            name: artistName,
            username: artistUsername,
            email: artistEmail,
            password: artistPassword,
            date_of_birth: artistDateOfBirth,

        };

        // Make the API call using Axios
        axios.post('/api/admin/artist/add', data)
            .then(function (response) {
                location.reload();
            })
            .catch(function (error) {
                alert('Lỗi thêm ca sĩ. Vui lòng thử lại.');
            });
    }
}