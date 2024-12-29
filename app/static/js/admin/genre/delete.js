function deleteGenre() {
    // Get the values from the form
    const genreId = $('#delete-genre-id').val();

    // Create the data object to send
    const data = {
        id: genreId
    };
    // Make the API call using Axios
    axios.delete('/api/admin/genre/delete', {
        data: data,
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(function (response) {
        location.reload();
    }).catch(function (error) {
        alert('Lỗi xóa thể loại. Vui lòng thử lại.');
    });
}