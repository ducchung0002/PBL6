// Music search functionality
getDevices();
const video_search_bar = document.getElementById('video_search_bar');
const resultsContainer = document.getElementById('video_search_results');
const query = video_search_bar.value;
const music_player = document.getElementById('music_player');
const karaoke_player = document.getElementById('karaoke_player');
const music_result = document.getElementById('music_result')
const music_artists = document.getElementById("music_artists");
let lyrics_sentences = [];
let lyrics_words = [];
const start_recording_button = document.getElementById('start_record');
const stop_recording_button = document.getElementById('stop_record');
const show_lyrics_record_button = document.getElementById('show_record_lyrics');
const show_lyrics_button = document.getElementById('show_lyrics');
const lyrics_tab = document.getElementById('lyrics_tab');
const preview_button = document.getElementById('preview-button');


let video_element = document.getElementById('video');
let recorded_blobs = [];
let lyrics_interval;
let start_time = 0;
let end_time = 0;
let music;
let show_lyric = false;
let show_lyric_detail = false;
let media_recorder = null;
function displayResults(results) {
    resultsContainer.innerHTML = "";
    results.forEach((result) => {
        const div = document.createElement("div");
        div.className = "result-item";
        div.textContent = result.name;
        div.onclick = () => {
            axios.post('/api/music/detail', {
                music_id: result.id,
            }).then(response => {
                music = response.data;
                music_player.src = music.audio_url;
                karaoke_player.src = music.audio_url;
                music_result.innerHTML = `<p>${music.name}</p>`;
                music_artists.innerHTML = "";
                music.artists.forEach((artist) => {
                    music_artists.appendChild(document.createTextNode(` - ${artist.name}`));
                })
                show_lyrics_button.style.display = "block";
                lyrics_sentences = processLyricsSentence(music.lyrics)
                lyrics_words = processLyricsWords(music.lyrics)
                seedLyricTab()
                start_recording_button.disabled = false;
            })
        };
        resultsContainer.appendChild(div);
    });
}
show_lyrics_button.onclick = () => {
    if (show_lyric_detail) {
        lyrics_tab.style.display = "none";
        show_lyric_detail = false;
    }
    else {
        lyrics_tab.style.display = "block";
        show_lyric_detail = true;
    }
}
show_lyrics_record_button.onclick = () => {
    const lyrics_container = document.getElementById('lyrics_container');
    if (show_lyric) {
        lyrics_container.style.display = "none";
        show_lyric = false;
    }
    else {
        lyrics_container.style.display = "block";
        show_lyric = true;
    }
}
function search_musics(query) {
    socket.emit("video_search", query);
    socket.on("video_search_results", (results) => {
        var music_results = results["musics"];
        displayResults(music_results);
    });
}
video_search_bar.addEventListener("keypress", function(event) {
    const query = video_search_bar.value;
    search_musics(query)
});
const start_minute_select = document.getElementById("start-minute-select");
const start_second_select = document.getElementById("start-second-select");
const end_minute_select = document.getElementById("end-minute-select");
const end_second_select = document.getElementById("end-second-select");
const set_start_time_button = document.getElementById("set-start-time-button");
const set_end_time_button = document.getElementById("set-end-time-button");
set_start_time_button.addEventListener("click", updateStartTime);
set_end_time_button.addEventListener("click", updateEndTime);
const start_time_display = document.getElementById("selected-start-time");
const end_time_display = document.getElementById("selected-end-time");
// Populate minutes and seconds
function populateTimeOptions() {
    for (let i = 0; i < 60; i++) {
        const startMinuteOption = document.createElement("option");
        startMinuteOption.value = i;
        startMinuteOption.textContent = i.toString().padStart(2, "0");
        start_minute_select.appendChild(startMinuteOption);

        const endMinuteOption = document.createElement("option");
        endMinuteOption.value = i;
        endMinuteOption.textContent = i.toString().padStart(2, "0");
        end_minute_select.appendChild(endMinuteOption);

        const startSecondOption = document.createElement("option");
        startSecondOption.value = i;
        startSecondOption.textContent = i.toString().padStart(2, "0");
        start_second_select.appendChild(startSecondOption);

        const endSecondOption = document.createElement("option");
        endSecondOption.value = i;
        endSecondOption.textContent = i.toString().padStart(2, "0");
        end_second_select.appendChild(endSecondOption);
    }
}
populateTimeOptions();

function updateStartTime() {
    let start_minute = start_minute_select.value.padStart(2, "0");
    let start_second = start_second_select.value.padStart(2, "0");
    start_time = (parseInt(start_minute, 10) * 60 + parseInt(start_second, 10)) * 1000;
    start_time_display.textContent = `Thời gian bắt đầu: ${start_minute}:${start_second}`;
}
function updateEndTime() {
    let end_minute = end_minute_select.value.padStart(2, "0");
    let end_second = end_second_select.value.padStart(2, "0");
    end_time = (parseInt(end_minute, 10) * 60 + parseInt(end_second, 10)) * 1000;
    end_time_display.textContent = `Thời gian kết thúc: ${end_minute}:${end_second}`;
}
function processLyricsSentence(lyrics){
    let lyric_sentences = [];
    lyrics.forEach(lyric => {
        let sentence="";
        lyric.forEach(word => {
            sentence += word.word + " ";
        })
        let lyric_sentence = {
            start_time: lyric[0].start_time,
            end_time: lyric[lyric.length-1].end_time,
            sentence: sentence
        };
        lyric_sentences.push(lyric_sentence);
    })
    return lyric_sentences;
}
function processLyricsWords(lyrics){
    let lyric_words = [];
    lyrics.forEach(lyric => {
        lyric.forEach(word => {
            let lyric_word = {
                start_time: word.start_time,
                sentence_end_time: lyric[lyric.length-1].end_time,
                end_time: word.end_time,
                word: word.word,
            }
            lyric_words.push(lyric_word);
        })
    })
    return lyric_words;
}
start_recording_button.addEventListener('click', async () => {
    // try {
    //     if (start_time >= end_time)
    //     {
    //         alert("Thời gian không hợp lệ.")
    //     }
    //     const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    //     video_element.srcObject = stream;
    //
    //     media_recorder = new MediaRecorder(stream);
    //     recorded_blobs = [];
    //
    //     media_recorder.ondataavailable = (event) => {
    //         if (event.data.size > 0) {
    //             recorded_blobs.push(event.data);
    //         }
    //     };
    //
    //     media_recorder.start();
    //     start_recording_button.disabled = true;
    //     stop_recording_button.disabled = false;
    //     show_lyrics_record_button.disabled = false;
    //
    //     music_player.currentTime = start_time / 1000;
    //     const duration = (end_time - start_time) / 1000;
    //
    //     music_player.play().then(() => {
    //         setTimeout(() => {
    //             music_player.pause();
    //             music_player.currentTime = start_time;
    //             stop_recording_button.click();
    //         }, duration * 1000);
    //     }).catch(error => {
    //         alert("Không thể phát được nhạc.");
    //     });
    //     startLyricsSync();
    // } catch (err) {
    //     alert('Không thể truy cập thiết bị');
    // }

    try {
        if (start_time >= end_time) {
            alert("Thời gian không hợp lệ.");
            return;
        }
        const audio_device_id = document.getElementById('audio_device').value;
        const video_device_id = document.getElementById('video_device').value;

        if (!audio_device_id && !video_device_id) {
            alert('Please select at least one device (audio or video) for recording.');
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

        // Create an AudioContext for mixing
        const audioContext = new AudioContext();

        // Create source nodes for user media and music player
        const userMediaAudioSource = audioContext.createMediaStreamSource(userMediaStream);
        const musicPlayerAudioSource = audioContext.createMediaElementSource(music_player);

        // Create a destination node to combine audio
        const audioDestination = audioContext.createMediaStreamDestination();

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
            setTimeout(() => {
                music_player.pause();
                music_player.currentTime = start_time;
                stop_recording_button.click();
            }, duration * 1000);
        }).catch(error => {
            alert("music player" + error);
        });

        karaoke_player.play().then(() => {
            setTimeout(() => {
                karaoke_player.pause();
                karaoke_player.currentTime = start_time;
                stop_recording_button.click();
            }, duration * 1000);
        }).catch(error => {
            alert("karaoke player" + error);
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
    show_lyrics_record_button.disabled = true;  // Disable the show lyrics button
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
    music_player.currentTime = 0;
}
preview_button.onclick = () => {
    if (recorded_blobs.length === 0) {
        alert("No recorded video available to preview.");
        return;
    }
    // Create a single Blob from recorded_blobs
    const video_blob = new Blob(recorded_blobs, { type: 'video/webm' });

    // Set the video source and enable controls
    video_element.src = URL.createObjectURL(video_blob);
    video_element.controls = true;
    start_recording_button.disabled = true;
    stop_recording_button.disabled = true;
}
function startLyricsSync() {
    const lyrics_container = document.getElementById('lyrics_container');

    let line1 = document.createElement('div');
    line1.classList.add('lyrics_line');
    let line2 = document.createElement('div');
    line2.classList.add('lyrics_line');

    lyrics_interval = setInterval(() => {
        const current_time = music_player.currentTime * 1000;

        // Find the current lyric based on the video's time
        const current_lyric = lyrics_sentences.find(lyric => {
            return current_time >= lyric.start_time && current_time <= lyric.end_time;
        });

        // If no lyric is found, hide the container
        if (!current_lyric) {
            lyrics_container.style.display = 'none';
            return;
        }

        // Find words for the current lyric sentence
        const current_sentence_words = lyrics_words.filter(word =>
            word.start_time >= current_lyric.start_time &&
            word.end_time <= current_lyric.end_time
        );

        // Clear previous content
        lyrics_container.innerHTML = '';
        if (show_lyric)
        {
            lyrics_container.style.display = 'block';
        }else{
            lyrics_container.style.display = 'none';
        }

        // Create and append word elements for the entire sentence
        current_sentence_words.forEach((word, index) => {
            let word_element = document.createElement('span');
            word_element.textContent = word.word + ' ';
            word_element.id = `word_${word.start_time}_${word.end_time}_${index}`;

            // Highlight the current word
            if (current_time >= word.start_time && current_time <= word.sentence_end_time) {
                word_element.classList.add('current-word');
            }

            lyrics_container.appendChild(word_element);
        });

    }, 100);  // Check every 100ms
}
function uploadRecordedVideo(){
    const title = document.getElementById('video-title').value;
    let music_id;
    if (!music){
        alert('Vui lòng chọn bài hát trước khi ghi hình.');
        return;
    }
    else{
        music_id = music.id;
    }

    if (!title) {
        alert('Vui lòng nhập tiêu đề trước khi ghi hình.');
        return;
    }

    if (recorded_blobs.length === 0) {
        alert('Không có video nào được ghi.');
        return;
    }

    const blob = new Blob(recorded_blobs, { type: 'video/webm' });
    const form_data = new FormData();
    const music_start = start_time;
    const music_end = end_time;

    form_data.append('video', blob, 'recorded-video.webm');
    form_data.append('title', title);
    form_data.append('music_id', music_id);
    form_data.append('music_start', music_start);
    form_data.append('music_end', music_end);

    axios.post(`/api/user/video/record`, form_data)
        .then(response => {
            // Check for both 200 (OK) and 201 (Created) as successful responses
            if (response.status !== 200 && response.status !== 201) {
                alert('Có lỗi xảy ra khi đăng video: ' + response.error);
            }
            return response.data; // Access response data directly in Axios
        })
        .then(data => {
            alert('Video đã được xử lý và đăng thành công');
        })
        .catch(error => {
            alert('Có lỗi xảy ra khi đăng video: ' + error.message);
        });
}
function seedLyricTab(){
    lyrics_sentences.forEach(lyric => {
        let row = document.createElement('tr');
        // row.classList.add('lyrics_tab_row');
        let lyric_tab_start_time = document.createElement('td');
        let lyric_tab_sentence = document.createElement('td');

        lyric_tab_start_time.textContent = formatTime(lyric.start_time);
        lyric_tab_sentence.textContent = '__'+lyric.sentence;

        row.appendChild(lyric_tab_start_time);
        row.appendChild(lyric_tab_sentence);

        lyrics_tab.appendChild(row);
    })
}
function formatTime(milliseconds) {
    const minutes = Math.floor(milliseconds / 60000); // Calculate minutes
    const seconds = Math.floor((milliseconds % 60000) / 1000); // Calculate remaining seconds

    // Pad the seconds with leading zero if needed
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
function getDevices() {
    navigator.mediaDevices.enumerateDevices()
        .then(function(devices) {
            let audio_select = document.getElementById('audio_device');
            let video_select = document.getElementById('video_device');

            // Clear existing options
            audio_select.innerHTML = '<option value="">Select Audio Device</option>';
            audio_select.innerHTML = '<option value="">Select Video Device</option>';

            // Enumerate devices and populate the dropdowns
            devices.forEach(function(device) {
                if (device.kind === 'audioinput') {
                    const option = document.createElement('option');
                    option.value = device.deviceId;
                    option.textContent = device.label || 'Default Audio Device';
                    audio_select.appendChild(option);
                }
                if (device.kind === 'videoinput') {
                    const option = document.createElement('option');
                    option.value = device.deviceId;
                    option.textContent = device.label || 'Default Video Device';
                    video_select.appendChild(option);
                }
            });
        })
        .catch(function(err) {
            console.error('Error enumerating devices:', err);
        });
}



