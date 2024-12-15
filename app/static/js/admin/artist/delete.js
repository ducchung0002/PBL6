function deleteArtist() {
    // Get the values from the form
    const artistId = document.getElementById('delete-artist-id').value;
    // Create the data object to send
    const data = {
        id: artistId
    };
    // Make the API call using Axios
    axios.delete('/api/admin/artist/', {
        data: data,
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(function (response) {
            location.reload();
        })
        .catch(function (error) {
            alert('Lỗi xóa ca sĩ. Vui lòng thử lại.');
        });
}