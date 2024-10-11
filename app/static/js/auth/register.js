function validate_register_information(event) {
    if (formSubmitting) {
        return; // Exit if already in the process of submitting
    }

    event.preventDefault(); // Prevent the form from submitting normally

    // Get the values from the form
    const name = document.getElementById('register-name').value;
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const DateOfBirth = document.getElementById('register-dob').value;
    const password = document.getElementById('register-password').value;
    // You can now use these values to update the genre
    // For example, you might send them to a server using an API call
    // Create the data object to send
    const data = {
        name: name,
        username: username,
        email: email,
        password: password,
        date_of_birth: DateOfBirth,
    };

    // Make the API call using Axios
    axios.post(`${window.config.API_BASE_URL}/api/auth/register/validate`, data)
        .then((response) => {
            console.log(response.data);
            if (response.data.success === true) {
                const form = event.target;
                form.onsubmit = null;
                form.requestSubmit();
            }
        })
        .catch(function (error) {
            console.error('Error register user:', error);
            alert('Error register user. Please try again.');
        });
}