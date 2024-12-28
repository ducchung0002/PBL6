const toggle_lyrics = document.getElementById('show_record_lyrics');
let video_show_lyric = false;
toggle_lyrics.onclick = () => {
    const lyrics_container = document.getElementById('lyrics_container');
    if (video_show_lyric) {
        lyrics_container.style.display = "none";
        video_show_lyric = false;
    }
    else {
        lyrics_container.style.display = "block";
        video_show_lyric = true;
    }
}