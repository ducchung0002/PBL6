document.addEventListener('DOMContentLoaded', function () {
    // Select all buttons with the class 'edit-btn'
    const editButtons = document.querySelectorAll('.edit-btn');
    const deleteButtons = document.querySelectorAll('.delete-btn');

    editButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            // Get the genre values from the button's data attributes
            const artistId = this.getAttribute('data-id');
            const artistName = this.getAttribute('data-name');
            const artistUsername = this.getAttribute('data-username')
            const artistDateOfBirth = this.getAttribute('data-dob');
            const artistEmail = this.getAttribute('data-email');
            // Now populate the modal's form fields
            const modal = document.querySelector('#edit-popup');
            modal.querySelector('#update-artist-id').value = artistId;
            modal.querySelector('#update-artist-name').value = artistName;
            modal.querySelector('#update-artist-username').value = artistUsername;
            modal.querySelector('#update-artist-dob').value = artistDateOfBirth;
            modal.querySelector('#update-artist-email').value = artistEmail;
        });
    });

    deleteButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            // Get the genre id from the button's data attribute
            const artistId = this.getAttribute('data-id');
            // Now display a confirmation modal
            const modal = document.querySelector('#delete-popup'); // Select your delete modal
            modal.querySelector('#delete-artist-id').value = artistId; // Hidden input for genre id
        });
    })
});
