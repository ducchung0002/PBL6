let playpause_btn = document.querySelector(".playpause-track");
let volume_slider = document.querySelector(".volume_slider");
let isPlaying = false;

window.onload = initializePlayer;
// Initialize the player with the music details from HTML
function initializePlayer() {
    // Set the audio source from the HTML
    const musicSrc = document.querySelector("#audio-source").value;
    if (musicSrc) {
        curr_track.src = musicSrc;
    }
    initializeLyrics()

    curr_track.addEventListener('ended', () => {
        isPlaying = false;
        playBack();
    });
}
function playBack() {
    curr_track.currentTime = 0; // Reset playback position
    playpause_btn.innerHTML = '<i class="fa fa-repeat fa-5x"></i>';
}
function playpauseTrack() {
    if (!isPlaying) playTrack();
    else pauseTrack();
}

function playTrack() {
    // Play the loaded track
    curr_track.play();
    isPlaying = true;
    // Replace icon with the pause icon
    playpause_btn.innerHTML = '<i class="fa fa-pause-circle fa-5x"></i>';
    highlightLyrics(curr_track.currentTime,lyrics);
}

function pauseTrack() {
    // Pause the loaded track
    curr_track.pause();
    isPlaying = false;
    // Replace icon with the play icon
    playpause_btn.innerHTML = '<i class="fa fa-play-circle fa-5x"></i>';
}
function setVolume() {
    // Set the volume according to the
    // percentage of the volume slider set
    curr_track.volume = volume_slider.value / 100;
}

let seek_slider = document.querySelector(".seek_slider");
let curr_time = document.querySelector(".current-time");
let total_duration = document.querySelector(".total-duration");

let curr_track = document.createElement('audio');

let updateTimer;

// Start playback and set the timer
curr_track.addEventListener('loadedmetadata', () => {
    total_duration.textContent = formatTime(curr_track.duration);
    updateTimer = setInterval(seekUpdate, 1000);
});

function seekUpdate() {
    if (!isNaN(curr_track.duration)) {
        let seekPosition = (curr_track.currentTime / curr_track.duration) * 100;
        seek_slider.value = seekPosition;

        curr_time.textContent = formatTime(curr_track.currentTime);
        total_duration.textContent = formatTime(curr_track.duration);
    }
}

function seekTo() {
    let seekToPosition = curr_track.duration * (seek_slider.value / 100);
    curr_track.currentTime = seekToPosition;
}

function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function toggleLyrics() {
    const layout = document.querySelector('.layout');
    const toggleCheckbox = document.querySelector('#lyrics-toggle');

    if (toggleCheckbox.checked) {
        // Add the 'lyrics-active' class to display the lyrics tab
        layout.classList.add('lyrics-active');
    } else {
        // Remove the 'lyrics-active' class to hide the lyrics tab
        layout.classList.remove('lyrics-active');
    }
}


// Render lyrics into the lyrics tab
function renderLyrics(lyrics) {
    const lyricsContent = document.querySelector('.lyrics-content');
    lyricsContent.innerHTML = lyrics
        .map((lyric, index) =>
            `<p class="lyric-line" id="${lyric.start_time}+${lyric.end_time}"
                data-start="${lyric.start_time}" data-end="${lyric.end_time}"
                style="text-align: center">
                ${lyric.sentence}
            </p>`
        ).join('');
}

// Highlight the active lyric based on current playback time
function highlightLyrics(currentTime, lyrics) {
    lyrics.forEach(line => {
        var layout = document.querySelector('.layout');
        var element = document.getElementById(`${line.start_time}+${line.end_time}`);
        var start = parseFloat(line.start_time)/1000;
        var end = parseFloat(line.end_time)/1000;
        if (currentTime >= start && currentTime <= end) {
            element.classList.add('active');
            if (layout.classList.contains('lyrics-active')) {
                element.scrollIntoView({
                    behavior: "smooth", // Smooth scrolling
                    block: "center",    // Align the element to the center of the container
                });
            }
        } else {
            element.classList.remove('active');
            element.focus();
        }
    });
}

// Initialize lyrics with music object
function initializeLyrics(
) {
    renderLyrics(lyrics);

    // Update lyrics highlight on audio playback
    curr_track.addEventListener('timeupdate', () => {
        highlightLyrics(curr_track.currentTime, lyrics);
    });
}