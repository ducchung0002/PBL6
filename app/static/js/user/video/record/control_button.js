const start_recording_button = document.getElementById('start_record');
const stop_recording_button = document.getElementById('stop_record');
const preview_button = document.getElementById('preview-button');
let recorded_blobs = [];
let lyrics_interval;

start_recording_button.addEventListener('click', async () => {
    try {
        lyrics_container.innerHTML =''
        if (audio_context.state === 'suspended') {
            audio_context.resume();
        }
        const blob_url = await getBlobUrl(music.karaoke_url);
        music_player.src = blob_url;
        karaoke_player.src = blob_url;

        if (start_time >= end_time) {
            alert("Thời gian không hợp lệ.");
            return;
        }
        const audio_device_id = document.getElementById('audio_device').value;
        const video_device_id = document.getElementById('video_device').value;

        if (!audio_device_id && !video_device_id) {
            alert('Vui lòng chọn thiết bị trước khi ghi hình.');
            return;
        }

        const constraints = {};

        if (audio_device_id) {
            constraints.audio = { deviceId: audio_device_id };
        }
        if (video_device_id) {
            constraints.video = { deviceId: video_device_id, width: 1280, height: 720 };
        }

        // Get user media (camera and microphone)
        const userMediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        video_element.srcObject = userMediaStream;
        video_element.controls = false;
        video_element.play();


        // Create source nodes for user media and music player
        const userMediaAudioSource = audio_context.createMediaStreamSource(userMediaStream);

        // Create a destination node to combine audio
        const audioDestination = audio_context.createMediaStreamDestination();

        // Connect both audio sources to the destination
        userMediaAudioSource.connect(audioDestination);
        musicPlayerAudioSource.connect(audioDestination);

        // Create a MediaRecorder for the combined audio and video
        const combinedStream = new MediaStream([
            ...userMediaStream.getVideoTracks(),
            ...audioDestination.stream.getAudioTracks(),
        ]);
        media_recorder = new MediaRecorder(combinedStream);
        recorded_blobs = [];

        media_recorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                recorded_blobs.push(event.data);
            }
        };

        media_recorder.start();
        start_recording_button.disabled = true;
        stop_recording_button.disabled = false;
        show_lyrics_record_button.disabled = false;

        // Set up music playback and sync
        music_player.currentTime = start_time / 1000;
        karaoke_player.currentTime = start_time / 1000;

        const duration = (end_time - start_time) / 1000;

        music_player.play().then(() => {
            timeoutId = setTimeout(() => {
                music_player.pause();
                music_player.currentTime = start_time;
                stop_recording_button.click();
                revokeBlobUrl(music_player.src);
            }, duration * 1000);
        }).catch(error => {
            alert("Có lỗi xảy ra" + error);
        });

        karaoke_player.play().then(() => {
            kara_timeoutId =setTimeout(() => {
                karaoke_player.pause();
                karaoke_player.currentTime = start_time;
                stop_recording_button.click();
                revokeBlobUrl(karaoke_player.src);
            }, duration * 1000);
        }).catch(error => {
            alert("Có lỗi xảy ra" + error);
        });

        startLyricsSync();
    } catch (err) {
        alert(err);
    }
});
stop_recording_button.onclick = () => {
    media_recorder.stop();
    start_recording_button.disabled = false;
    stop_recording_button.disabled = true;
    show_lyrics_record_button.disabled = true;
    preview_button.disabled = false;

    let stream = video_element.srcObject;
    let tracks = stream.getTracks();
    tracks.forEach(track => track.stop());

    video_element.srcObject = null;

    // Stop syncing lyrics
    clearInterval(lyrics_interval);

    // Hide the lyrics container after the recording stops
    const lyrics_container = document.getElementById('lyrics_container');
    lyrics_container.style.display = 'none';  // Hide the lyrics after stopping the recording

    // Stop the music playback when recording stops
    music_player.pause();
    karaoke_player.pause();
    revokeBlobUrl(music_player.src);
    revokeBlobUrl(karaoke_player.src);
    music_player.currentTime = 0;

    cancelTimeout(timeoutId)
    cancelTimeout(kara_timeoutId)
}
preview_button.onclick = () => {
    if (recorded_blobs.length === 0) {
        alert("Chưa có video nào được ghi.");
        return;
    }
    // Create a single Blob from recorded_blobs
    const video_blob = new Blob(recorded_blobs, { type: 'video/webm' });

    // Set the video source and enable controls
    video_element.src = URL.createObjectURL(video_blob);
    video_element.controls = true;
    start_recording_button.disabled = false;
    stop_recording_button.disabled = true;
}