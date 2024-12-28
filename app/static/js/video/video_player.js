axios.post('/api/music/detail', {
    music_id: music_id,
}).then (async response => {
    const music = response.data;
    lyrics_sentences = processLyricsSentence(music.lyrics)
    lyrics_words = processLyricsWords(music.lyrics)
})
// Play/Pause toggle
playPauseButton.addEventListener('click', () => {
    if (video.paused) {
        video.play();
        playPauseButton.textContent = '⏸';
        startLyricsSync()
    } else {
        video.pause();
        playPauseButton.textContent = '►';
        clearLyricsSync()
    }
});

// Update progress bar
video.addEventListener('timeupdate', () => {
    const progress = (video.currentTime / video.duration) * 100;
    progressBar.value = progress;
});

// Seek video
progressBar.addEventListener('input', () => {
    const seekTime = (progressBar.value / 100) * video.duration;
    video.currentTime = seekTime;
});

// Volume control
volumeToggle.addEventListener('click', () => {
    video.muted = !video.muted;
    volumeToggle.textContent = video.muted ? '🔇' : '🔊';
});

volumeSlider.addEventListener('input', () => {
    video.volume = volumeSlider.value;
});

// Fullscreen toggle
fullscreenButton.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        video.parentElement.requestFullscreen();
        const lyricsOverlay = document.querySelectorAll('.lyrics-overlay');
        const lyric_words = document.querySelectorAll('.lyric-words');
        // Change the font size
        lyricsOverlay.forEach(element => {
            element.style.fontSize = '60px';
        })
        lyric_words.forEach(element => {
            element.style.marginRight = '15px';
        })
    } else {
        document.exitFullscreen();
        const lyricsOverlay = document.querySelectorAll('.lyrics-overlay');
        const lyric_words = document.querySelectorAll('.lyric-words');
        lyricsOverlay.forEach(element => {
            element.style.fontSize = '24px';
        })
        lyric_words.forEach(element => {
            element.style.marginRight = '5px';
        })
    }
});

document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
        const lyricsOverlay = document.querySelectorAll('.lyrics-overlay');
        const lyric_words = document.querySelectorAll('.lyric-words');
        // Exited fullscreen, reset styles
        lyricsOverlay.forEach(element => {
            element.style.fontSize = '24px';
        })
        lyric_words.forEach(element => {
            element.style.marginRight = '5px';
        })
    }
});
video.addEventListener('ended', () => {
    clearLyricsSync();
    playPauseButton.textContent = '↺';
});