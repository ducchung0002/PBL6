let mediaRecorder; // Declare mediaRecorder in a broader scope
let chunks = [];   // To store recorded audio data
let intervalId;
/**
 * Starts the audio recording using the default audio input device.
 */
async function startRecording() {
    try {
        const constraints = { audio: true };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);

        mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        chunks = []; // Reset chunks

        // Event handler for when data is available
        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                chunks.push(event.data);
            }
        };

        mediaRecorder.onstop = async () => {
            if (chunks.length > 0) {
                const blob = new Blob(chunks, { type: 'audio/webm' });
                // chunks = []; // Clear chunks after creating the Blob

                try {
                    const base64Audio = await blobToBase64(blob);
                    const response = await fetch(SERVER_SHAZAM, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ audio: base64Audio }),
                    });

                    if (!response.ok) {
                        throw new Error(`Server error: ${response.statusText}`);
                    }

                    const result = await response.json();
                    socket.emit('music_search', result.result);
                    socket.on("music_search_results", (results) => {
                        const music_results = results["musics"][0];
                        window.location = `/music/${music_results.id}`
                    });
                    console.log('Response from server:', result.result);
                    document.getElementById('results').textContent = JSON.stringify(result, null, 2);
                } catch (error) {
                    console.error('Error sending audio to server:', error.message);
                    document.getElementById('results').textContent = `Error: ${error.message}`;
                }
            }
        };

        // Start recording
        mediaRecorder.start();

        // Send audio chunks at regular intervals
        intervalId = setInterval(() => {
            if (mediaRecorder.state === 'recording') {
                mediaRecorder.stop();
                mediaRecorder.start();
            }
        }, 5000);

    } catch (error) {
        alert('Could not access audio devices. Please check permissions.');
    }
}

function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        clearInterval(intervalId); // Stop the interval
        mediaRecorder.stop(); // Stop the recording
    }
}
// Set up event listener for the Start button
const recordButton = document.getElementById('shazam-record');
let isRecording = false; // Track recording state

recordButton.addEventListener('click', async () => {
    try {
        if (!isRecording) {
            await startRecording();
            isRecording = true;
        } else {
            stopRecording();
            isRecording = false;
        }
    } catch (error) {
        console.error('Error toggling recording:', error);
    }
});

/**
 * Converts a Blob to a Base64-encoded string.
 * @param {Blob} blob - The Blob to convert.
 * @returns {Promise<string>} - A promise that resolves to the Base64 string.
 */
function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result.split(',')[1]; // Remove data URL part
            resolve(base64String);
        };
        reader.onerror = () => {
            reject(new Error('Failed to convert blob to Base64'));
        };
        reader.readAsDataURL(blob);
    });
}