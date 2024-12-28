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
                alert('Vui lòng chọn định dạng ảnh phù hợp (JPEG, PNG, GIF).',"info");
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
    if(dobValidate(dob))
    {
        // Create the data object to send
        axios.put('/api/user/profile/update', data)
            .then(function (response) {
                deactivateModal('user-edit-popup');
                Swal.fire({
                    icon: "success",
                    title: "Cập nhật hồ sơ thành công!",
                    confirmButtonText: 'OK',
                    footer: `<a href="/user/profile/home/${userId}">Xem hồ sơ</a>`
                });
            })
            .catch(function (error) {
                alert('Lỗi cập nhật hồ sơ. Vui lòng thử lại.');
            });
    }
}
function dobValidate(dob){
    if (!dob) {
        alert('Ngày sinh không được để trống.');
        return false
    }
    const dobDate = new Date(dob);
    const year = dobDate.getFullYear();
    const month = dobDate.getMonth() + 1; // Months are zero-based
    const day = dobDate.getDate();
    const formattedDate = `${month}/${day}/${year}`;
    if (new Date(formattedDate) > new Date()) {
        alert('Ngày sinh không hợp lệ.');
        return false
    }
    return true
}




