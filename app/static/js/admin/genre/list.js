document.addEventListener('DOMContentLoaded', function () {
    // Select all buttons with the class 'edit-btn'
    const editButtons = document.querySelectorAll('.edit-btn');
    const deleteButtons = document.querySelectorAll('.delete-btn');
    editButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            // Get the genre values from the button's data attributes
            var genreId = this.getAttribute('data-id');
            var genreName = this.getAttribute('data-name');
            var genreDescription = this.getAttribute('data-description');
            // Now populate the modal's form fields
            var modal = document.querySelector('#edit-popup'); // Select your edit modal
            modal.querySelector('#update-genre-id').value = genreId; // Hidden input for genre id
            modal.querySelector('#update-genre-name').value = genreName; // Input for genre name
            modal.querySelector('#update-genre-description').value = genreDescription; // Input for genre description
        });
    });

    deleteButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            // Get the genre id from the button's data attribute
            var genreId = this.getAttribute('data-id');
            console.log('Deleting genre:', genreId);
            // Now display a confirmation modal
            var modal = document.querySelector('#delete-popup'); // Select your delete modal
            // console.log('Genre ID:', modal);
            modal.querySelector('#delete-genre-id').value = genreId; // Hidden input for genre id
        });
    })
});
