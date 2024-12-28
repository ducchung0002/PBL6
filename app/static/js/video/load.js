const video = document.getElementById('video');
const playPauseButton = document.getElementById('play-pause');
const progressBar = document.getElementById('progress-bar');
const volumeToggle = document.getElementById('volume-toggle');
const volumeSlider = document.getElementById('volume-slider');
const fullscreenButton = document.getElementById('fullscreen');

let lyrics_sentences = [];
let lyrics_words = [];
let lyrics_interval