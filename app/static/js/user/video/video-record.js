
let mediaRecorder;
let recordedBlobs = [];
const videoElement = document.getElementById('video');
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');

startButton.addEventListener('click', async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    videoElement.srcObject = stream;

    mediaRecorder = new MediaRecorder(stream);
    recordedBlobs = [];

    mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
            recordedBlobs.push(event.data);
        }
    };

    mediaRecorder.start();
    startButton.disabled = true;
    stopButton.disabled = false;
});

stopButton.addEventListener('click', () => {
    mediaRecorder.stop();
    startButton.disabled = false;
    stopButton.disabled = true;

    let stream = videoElement.srcObject;
    let tracks = stream.getTracks();
    tracks.forEach(track => track.stop());

    videoElement.srcObject = null;
});

function uploadVideo() {
    // Get title and description by ID
    const title = document.getElementById('title').value;

    if (!title) {
        alert('Please provide both a title and description.');
        return;
    }

    if (recordedBlobs.length === 0) {
        alert('No video recorded to upload.');
        return;
    }

    const blob = new Blob(recordedBlobs, { type: 'video/webm' });
    const formData = new FormData();

    // Add the video blob, title, and description to the FormData
    formData.append('video', blob, 'recorded-video.webm');
    formData.append('title', title);
    console.log('Form data:', formData);
    // Upload the video
    fetch('/api/user/video/record', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (!response.ok) {
                return response.text().then(errorText => {
                    console.error('Error:', response.status, errorText);
                    throw new Error('Network response was not ok: ' + response.status + ' - ' + errorText);
                });
            }
            return response.json();
        })
        .then(data => {
            alert('Video uploaded successfully: ' + data.url);
        })
        .catch(error => {
            console.error('Error during video upload:', error);
            alert('An error occurred while uploading the video: ' + error.message);
        });
}