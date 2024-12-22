const show_lyrics_record_button = document.getElementById('show_record_lyrics');
let show_lyric = false;
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