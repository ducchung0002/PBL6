document.addEventListener('DOMContentLoaded', function () {
    const dropdownButton = document.getElementById('dropdownButton');
    const dropdownMenu = document.getElementById('dropdownMenu');

    if (dropdownButton) {
        dropdownButton.addEventListener('click', function () {
            dropdownMenu.classList.toggle('d-none');
        });

        document.addEventListener('click', function (event) {
            if (!dropdownButton.contains(event.target) && !dropdownMenu.contains(event.target)) {
                dropdownMenu.classList.add('hidden');
            }
        });
    }
});

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