document.addEventListener('DOMContentLoaded', function () {
    const editButtons = document.querySelectorAll('.edit-btn');
    editButtons.forEach(function (button){
        button.addEventListener('click', function (event) {
            // Get the genre values from the button's data attributes
            const userId = this.getAttribute('data-id');
            const userName = this.getAttribute('data-name');
            const userUsername = this.getAttribute('data-username')
            const userDateOfBirth = this.getAttribute('data-dob');
            const userEmail = this.getAttribute('data-email');
            const userAvatar = this.getAttribute('data-avt');
            // Now populate the modal's form fields
            const modal = document.querySelector('#edit-popup');
            modal.querySelector('#update-user-id').value = userId;
            modal.querySelector('#update-user-name').value = userName;
            modal.querySelector('#update-user-username').value = userUsername;
            modal.querySelector('#update-user-dob').value = userDateOfBirth;
            modal.querySelector('#update-user-email').value = userEmail;
            modal.querySelector('#update-user-avatar').value = userAvatar;
    });
})});

// JavaScript to move underline
const tabLinks = document.querySelectorAll('.tab-link');
const underline = document.querySelector('.underline');

// Function to update the underline position
function updateUnderline() {
    const activeTab = document.querySelector('.tab-link.active');
    const rect = activeTab.getBoundingClientRect();
    const containerRect = document.querySelector('.custom-tab-container').getBoundingClientRect();

    underline.style.width = `${rect.width}px`;
    underline.style.left = `${rect.left - containerRect.left}px`;
}

// Add event listeners to each tab link
tabLinks.forEach(tab => {
    tab.addEventListener('click', function() {
        // Remove active class from all tabs
        tabLinks.forEach(t => t.classList.remove('active'));

        // Add active class to clicked tab
        tab.classList.add('active');

        // Update underline position
        updateUnderline();
    });
});

// Initial underline position
window.addEventListener('load', updateUnderline);
window.addEventListener('resize', updateUnderline);
