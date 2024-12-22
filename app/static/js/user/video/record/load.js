// Music search functionality
getDevices();
populateTimeOptions();
const music_player = document.getElementById('music_player');
const karaoke_player = document.getElementById('karaoke_player');
const music_result = document.getElementById('music_result')
const music_artists = document.getElementById("music_artists");

let lyrics_sentences = [];
let lyrics_words = [];

let audio_context = new AudioContext();
let musicPlayerAudioSource = audio_context.createMediaElementSource(music_player);
let video_element = document.getElementById('video');

let start_time = 0;
let end_time = 0;

let music;
let media_recorder = null;

let timeoutId;
let kara_timeoutId;

const cookie_music_id = getCookie('music_id');
if (cookie_music_id){
    console.log('Music ID:', cookie_music_id);
    axios.post('/api/music/detail', {
        music_id: cookie_music_id,
    }).then (async response => {
        music = response.data;
        await updateMusicDetails(music)
    })
}
function getDevices() {
    navigator.mediaDevices.enumerateDevices()
        .then(function(devices) {
            let audio_select = document.getElementById('audio_device');
            let video_select = document.getElementById('video_device');

            // Enumerate devices and populate the dropdowns
            devices.forEach(function(device, index) {
                if (device.kind === 'audioinput') {
                    const option = document.createElement('option');
                    if (index === 0){
                        option.selected = true;
                    }
                    option.value = device.deviceId;
                    option.textContent = device.label || 'Thiết bị mặc định';
                    audio_select.appendChild(option);
                }
                if (device.kind === 'videoinput') {
                    const option = document.createElement('option');
                    if (index === 0){
                        option.selected = true;
                    }
                    option.value = device.deviceId;
                    option.textContent = device.label || 'Thiết bị mặc định';
                    video_select.appendChild(option);
                }
            });
        })
        .catch(function(err) {
            alert('Có lỗi khi truy cập thiết bị:', err);
        });
}
function cancelTimeout(timeoutId) {
    if (timeoutId) {
        clearTimeout(timeoutId);
    }
}
function getAudioDuration(url) {
    return new Promise((resolve, reject) => {
        const audio = new Audio();
        audio.src = url;

        // Ensure the audio is loaded to retrieve metadata
        audio.addEventListener('loadedmetadata', () => {
            if (audio.duration === Infinity) {
                // Handle edge case where duration is Infinity
                audio.currentTime = Number.MAX_SAFE_INTEGER;
                audio.ontimeupdate = () => {
                    audio.ontimeupdate = null; // Remove the event listener
                    resolve(audio.duration);
                    audio.currentTime = 0; // Reset time
                };
            } else {
                resolve(audio.duration);
            }
        });

        // Handle errors
        audio.addEventListener('error', (event) => {
            reject(new Error('Failed to load audio metadata'));
        });
    });
}
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}