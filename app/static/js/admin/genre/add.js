function addGenre(event) {
    event.preventDefault(); // Prevent the form from submitting normally

    // Get the values from the form
    const genreId = $('#genre-id').val();
    const genreName = $('#genre-name').val();
    const genreDescription = $('#genre-description').val();

    // You can now use these values to update the genre
    // For example, you might send them to a server using an API call
    console.log('Updating genre:', { id: genreId, name: genreName, description: genreDescription });
    // Create the data object to send
    const data = {
        id: genreId,
        name: genreName,
        description: genreDescription
    };

    // Make the API call using Axios
    axios.post('/api/admin/genre/add', data)
        .then(function (response) {
            location.reload();
        })
        .catch(function (error) {
            alert('Lỗi thêm thể loại. Vui lòng thử lại.')
        });
}