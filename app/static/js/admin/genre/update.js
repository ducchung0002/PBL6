function updateGenre(event) {
    event.preventDefault(); // Prevent the form from submitting normally

    // Get the values from the form
    const genreId = $('#update-genre-id').val();
    const genreName = $('#update-genre-name').val();
    const genreDescription = $('#update-genre-description').val();

    // Create the data object to send
    const data = {
        id: genreId,
        name: genreName,
        description: genreDescription
    };

    // Make the API call using Axios
    axios.put('/api/admin/genre/update', data)
        .then(function (response) {
            location.reload();
        })
        .catch(function (error) {
            console.error('Error updating genre:', error);
            alert('Lỗi cập nhật thể loại. Vui lòng thử lại.');
        });

}