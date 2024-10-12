document.addEventListener('DOMContentLoaded', function () {
    const dropdownButton = document.getElementById('dropdownButton');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const content = document.getElementById('content');
    const contentWrapper = document.getElementById('content-wrapper');

    if (dropdownButton) {
        dropdownButton.addEventListener('click', function () {
            dropdownMenu.classList.toggle('d-none');
        });

        document.addEventListener('click', function (event) {
            if (!dropdownButton.contains(event.target) && !dropdownMenu.contains(event.target)) {
                dropdownMenu.classList.add('d-none');
            }
        });
    }

    if (sidebarToggle && sidebar && content && contentWrapper) {
        sidebarToggle.addEventListener('click', toggleSidebar);
    }
});

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const content = document.getElementById('content');
    const contentWrapper = document.getElementById('content-wrapper');

    sidebar.classList.toggle('collapsed');
    content.classList.toggle('expanded');
    contentWrapper.classList.toggle('expanded');
}

function voice() {
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
        var recognition = new SpeechRecognition();
        recognition.lang = 'vi-VN';
        recognition.onresult = function (event) {
            console.log(event);
            console.log(event.results[0][0].transcript);
            document.getElementById("search_bar").value = event.results[0][0].transcript;
        }
        recognition.start();
    } else {
        console.log("Speech recognition not supported in this browser.");
    }
}