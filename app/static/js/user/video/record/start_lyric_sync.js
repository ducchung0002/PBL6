const PREVIEW_TIME = 1000; // Show lyrics 2 seconds before they start
const GAP_THRESHOLD = 5000; // Maximum gap to display lyrics

function startLyricsSync() {
    const lyrics_container = document.getElementById('lyrics_container');

    lyrics_interval = setInterval(() => {
        const current_time = music_player.currentTime * 1000;

        // Find current or upcoming lyric sentence
        const currentIndex = lyrics_sentences.findIndex(lyric => {
            return (current_time + PREVIEW_TIME) >= lyric.start_time && current_time <= lyric.end_time;
        });

        const current_lyric = lyrics_sentences[currentIndex];
        const next_lyric = lyrics_sentences[currentIndex + 1];

        if (current_lyric && next_lyric) {
            const gap = next_lyric.start_time - current_lyric.end_time;
            if (gap > GAP_THRESHOLD) {
                lyrics_container.innerHTML = '';
                lyrics_container.style.display = 'none';
                return;
            }
        }

        let line_1_lyric;
        let line_2_lyric;

        if (currentIndex % 2 === 0) {
            line_1_lyric = lyrics_sentences[currentIndex];
            line_2_lyric = lyrics_sentences[currentIndex + 1];
        } else {
            line_1_lyric = lyrics_sentences[currentIndex - 1];
            line_2_lyric = lyrics_sentences[currentIndex];
        }

        // Find words for the current lyric sentence
        const line1_words = lyrics_words.filter(word =>
            word.start_time >= line_1_lyric?.start_time &&
            word.end_time <= line_1_lyric?.end_time
        );
        const line2_words = lyrics_words.filter(word =>
            word.start_time >= line_2_lyric?.start_time &&
            word.end_time <= line_2_lyric?.end_time
        );

        // Clear previous content
        lyrics_container.innerHTML = '';
        if (show_lyric) {
            lyrics_container.style.display = 'block';
        } else {
            lyrics_container.style.display = 'none';
        }

        line1_words.forEach(word => {
            let word_element = document.createElement('span');
            word_element.style.marginRight = '5px';
            word.word.split('').forEach((char, index) => {
                const char_span = document.createElement('span');
                char_span.textContent = char;
                const start = parseInt(word.start_time, 10);
                const end = parseInt(word.end_time, 10);
                const length = word.word.length;
                const charDuration = (end - start) / length;
                const charStartTime = start + index * charDuration;
                if (current_time >= charStartTime) {
                    char_span.style.color = "yellow";
                }
                word_element.appendChild(char_span);
            });
            lyrics_container.appendChild(word_element);
        });

        lyrics_container.appendChild(document.createElement('br'));

        line2_words.forEach(word => {
            let word_element = document.createElement('span');
            word_element.style.marginRight = '5px';
            word.word.split('').forEach((char, index) => {
                const char_span = document.createElement('span');
                char_span.textContent = char;
                const start = parseInt(word.start_time, 10);
                const end = parseInt(word.end_time, 10);
                const length = word.word.length;
                const charDuration = (end - start) / length;
                const charStartTime = start + index * charDuration;
                if (current_time >= charStartTime) {
                    char_span.style.color = "yellow";
                }
                word_element.appendChild(char_span);
            });
            lyrics_container.appendChild(word_element);
        });
    }, 100);
}