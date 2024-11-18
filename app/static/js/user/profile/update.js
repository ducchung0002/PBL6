$(document).ready(function() {
    // Listen for changes on the file input
    $('#update-user-avatar').on('change', function(event) {
        const input = event.target;

        // Ensure a file is selected
        if (input.files && input.files[0]) {
            const file = input.files[0];

            // Validate file type (optional)
            const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if ($.inArray(file.type, validImageTypes) < 0) {
                alert('Please select a valid image file (JPEG, PNG, GIF).');
                return;
            }

            // Create a FileReader to read the file
            const reader = new FileReader();

            // Define the onload callback
            reader.onload = function(e) {
                // Set the src of the avatar image to the file's data URL
                $('#user-avatar').attr('src', e.target.result);
            };

            // Read the file as a Data URL (base64 encoded string)
            reader.readAsDataURL(file);
        }
    });
});
function updateProfile(event){
    event.preventDefault(); // Prevent the form from submitting normally
    // Get the values from the form
    const userId = $('#update-user-id').val();
    const name = $('#update-user-name').val();
    const username = $('#update-user-username').val();
    const email = $('#update-user-email').val();
    const dob = $('#update-user-dob').val();
    const bio = $('#update-user-bio').val();
    const avatar = $('#update-user-avatar')[0];
    const data = new FormData();
    if(avatar.files && avatar.files[0]) {
        // Convert the file to a Blob object
        const file = avatar.files[0];
        data.append('image', file, `${username}-avatar.jpg`);
    }
    data.append('id', userId);
    data.append('name', name);
    data.append('username', username);
    data.append('email', email);
    data.append('date_of_birth', dob);
    data.append('bio', bio);
    // Create the data object to send
    axios.put('/api/user/profile/', data)
        .then(function (response) {
            location.reload();
            alert('Profile updated successfully!');
        })
        .catch(function (error) {
            console.error('Error updating profile:', error);
            alert('Error updating profile. Please try again.');
        });
}




