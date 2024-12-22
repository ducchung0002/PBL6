function processLyricsSentence(lyrics){
    let lyric_sentences = [];
    lyrics.forEach((lyric) => {
        let sentence="";
        lyric.forEach(word => {
            sentence += word.word + " ";
        })
        let lyric_sentence = {
            start_time: lyric[0].start_time,
            end_time: lyric[lyric.length-1].end_time,
            sentence: sentence,
        };
        lyric_sentences.push(lyric_sentence);
    })
    return lyric_sentences;
}
function processLyricsWords(lyrics){
    let lyric_words = [];
    lyrics.flat().forEach(({ start_time, end_time, word }) => {
        lyric_words.push({ start_time, end_time, word });
    });
    return lyric_words;
}