console.log('App.js is running!');
    document.addEventListener('DOMContentLoaded', function () {
        const closeLoginButton = document.getElementById('close-button');
        // const closeRegisterButton = document.querySelector('#register-popup #close-button');
        const closeRegisterButton = document.querySelector('#register-popup .btn-close');
        const loginPopup = document.getElementById('login-popup');
        const registerPopup = document.getElementById('register-popup');
        const loginButton = document.getElementById('login-button');
        const switchToRegisterLink = document.getElementById('switch-to-register');
        const switchToLoginLink = document.getElementById('switch-to-login');

        // Login popup functionality
        if (closeLoginButton && loginPopup && loginButton) {
            console.log('Adding event listeners to login popup');
            closeLoginButton.addEventListener('click', function () {
                loginPopup.classList.add('hidden');
                loginPopup.classList.remove('flex');
            });

            loginButton.addEventListener('click', function () {
                loginPopup.classList.remove('hidden');
                loginPopup.classList.add('flex');
            });
        }

        // Register popup functionality
        if (closeRegisterButton && registerPopup) {
            closeRegisterButton.addEventListener('click', function () {
                registerPopup.classList.add('hidden');
                registerPopup.classList.remove('flex');
            });
        }

        // Switch from login to register
        if (switchToRegisterLink && loginPopup && registerPopup) {
            switchToRegisterLink.addEventListener('click', function (e) {
                e.preventDefault();
                loginPopup.classList.add('hidden');
                loginPopup.classList.remove('flex');
                registerPopup.classList.remove('hidden');
                registerPopup.classList.add('flex');
            });
        }if (switchToLoginLink && loginPopup && registerPopup) {
            switchToLoginLink.addEventListener('click', function (e) {
                e.preventDefault();
                loginPopup.classList.add('flex');
                loginPopup.classList.remove('hidden');
                registerPopup.classList.remove('flex');
                registerPopup.classList.add('hidden');
            });
        }
    });
