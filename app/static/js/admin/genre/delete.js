function deleteGenre() {
    // Get the values from the form
    const genreId = $('#delete-genre-id').val();

    // Create the data object to send
    const data = {
        id: genreId
    };
    console.log('Deleting genre:', data);
    // Make the API call using Axios
    axios.delete('/api/admin/genre/', {
        data: data,
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(function (response) {
        location.reload();
    }).catch(function (error) {
        console.error('Error updating genre:', error);
        alert('Error updating genre. Please try again.');
    });
}