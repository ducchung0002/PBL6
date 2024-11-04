function login(event) {
    event.preventDefault(); // Prevent the form from submitting normally

    // Get the values from the form
    const username = $('#login-username').val();
    const password = $('#login-password').val();

    const data = {
        username: username,
        password: password,
    };

    // Make the API call using Axios
    axios.post('/api/auth/login/validate', data)
        .then(function (response) {
            const rep = response.data;

            if (rep.success === true) {
                const form = event.target;
                form.onsubmit = null;
                form.requestSubmit();
            } else {
                if (rep.error === 'wrong password') {
                    alert('wrong password');
                } else if (rep.error === 'not found') {
                    alert('user not found');
                }
            }
        })
        .catch(function (error) {
            console.error('Error adding artist:', error);
            alert('Error adding artist. Please try again.');
        });
}
