document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const content = document.getElementById('content');

    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
        if (content) {
            content.classList.toggle('col-md-10');
            content.classList.toggle('col-md-12');
        }
    });
});