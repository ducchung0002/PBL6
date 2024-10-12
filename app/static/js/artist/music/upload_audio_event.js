/**
 *   audio upload event functionality
 */
// Handle click on the upload region to open file dialog
// audio upload input
audioUploadRegion.addEventListener('click', () => {
    audioUploadInput.click();
});

// Handle file selection and load into WaveSurfer
audioUploadInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    processAudioFile(file);
});

// Handle drag-and-drop events
audioUploadRegion.addEventListener('dragover', (event) => {
    event.preventDefault();
    event.stopPropagation();
    audioUploadRegion.classList.add('border-primary'); // Highlight region during drag
});

audioUploadRegion.addEventListener('dragleave', (event) => {
    event.preventDefault();
    event.stopPropagation();
    audioUploadRegion.classList.remove('border-primary'); // Remove highlight
});

audioUploadRegion.addEventListener('drop', (event) => {
    event.preventDefault();
    event.stopPropagation();
    audioUploadRegion.classList.remove('border-primary'); // Remove highlight

    const file = event.dataTransfer.files[0];
    if (file) {
        processAudioFile(file);
    }
});
/**
 *   karaoke upload event functionality
 */
karaokeUploadRegion.addEventListener('click', () => {
    karaokeUploadInput.click();
});

// Handle file selection and load into WaveSurfer
karaokeUploadInput.addEventListener('change', (event) => {
    processKaraokeFile(event.target.files[0]);
});

// Handle drag-and-drop events
karaokeUploadRegion.addEventListener('dragover', (event) => {
    event.preventDefault();
    event.stopPropagation();
    karaokeUploadRegion.classList.add('border-primary'); // Highlight region during drag
});

karaokeUploadRegion.addEventListener('dragleave', (event) => {
    event.preventDefault();
    event.stopPropagation();
    karaokeUploadRegion.classList.remove('border-primary'); // Remove highlight
});

karaokeUploadRegion.addEventListener('drop', (event) => {
    event.preventDefault();
    event.stopPropagation();
    karaokeUploadRegion.classList.remove('border-primary'); // Remove highlight

    processKaraokeFile(event.dataTransfer.files[0]);
});

/**
 *   thumbnail upload event functionality
 */

separateAudioButton.addEventListener('click', function () {
    if (!audio_file) {
        Swal.fire({
            icon: 'error',
            title: 'Hãy đăng tải bài hát!',
            confirmButtonText: 'OK'
        })
    }
    let formData = new FormData();
    formData.append('audio', audio_file);

    const $button = $(this);
    let text = $button.text();
    $button.html('<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Đang đăng tải...');
    $button.prop('disabled', true); // Disable the button to prevent multiple clicks

    axios.post(SERVER_SEPARATE_AUDIO, formData, {headers: {'Content-Type': 'multipart/form-data',}})
        .then((response) => {
            $alignLyricText.val(JSON.stringify(response.data, null, 2));
        })
        .catch((error) => {
            if (error.response) {
                console.error("Error Data:", error.response.data);
                console.error("Status Code:", error.response.status);
            } else {
                console.error("Error:", error.message);
                Swal.fire({
                    icon: "error",
                    title: "Network Error",
                    text: 'Kiểm tra kết nối mạng',
                });
            }
        })
        .finally(() => {
            $button.html(text); // Change to original button text
            $button.prop('disabled', false);
        });
})

thumbnailUploadBtn.addEventListener('click', () => thumbnailUploadInput.click())

thumbnailUploadInput.addEventListener('change', (event) => processThumbnailFile(event.target.files[0]));

/**
 *   Function to handle file processing
 */
function processAudioFile(file) {
    if (file && file.type.startsWith('audio/')) {
        audio_file = file;
        audioUrl = URL.createObjectURL(file);
        wavesurfer.load(audioUrl); // Load the audio file into WaveSurfer
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Vui lòng chọn file âm thanh hợp lệ.',
        })
    }
}

function processKaraokeFile(file) {
    if (file && file.type.startsWith('audio/')) {
        karaoke_file = file;
        karaokeAudioPlayer.src = URL.createObjectURL(file);
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Vui lòng chọn file âm thanh hợp lệ.',
        })
    }
}

function processThumbnailFile(file) {
    if (file && file.type.startsWith('image/')) {
        thumbnail_file = file;
        thumbnailPreview.src = URL.createObjectURL(file);
        thumbnailPreview.classList.remove('d-none'); // Remove the hidden class to show the thumbnail preview
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Vui lòng chọn file ảnh hợp lệ.',
        })
    }
}