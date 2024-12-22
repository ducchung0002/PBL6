const show_lyrics_tab_button = document.getElementById('show_lyrics');
let show_lyric_detail = false;
const lyrics_tab = document.getElementById('lyrics_tab');
show_lyrics_tab_button.onclick = () => {
    if (show_lyric_detail) {
        lyrics_tab.style.display = "none";
        show_lyric_detail = false;
    }
    else {
        lyrics_tab.style.display = "block";
        show_lyric_detail = true;
    }
}
function seedLyricTab(){
    while (lyrics_tab.firstChild) {
        lyrics_tab.removeChild(lyrics_tab.firstChild);
    }
    lyrics_sentences.forEach(lyric => {
        let row = document.createElement('tr');
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