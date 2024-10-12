class Word {
    constructor(start_time, end_time, word) {
        if (start_time < 0 || end_time < 0 || typeof word !== "string") {
            throw new Error("Invalid parameters for Word");
        }
        this.start_time = start_time;
        this.end_time = end_time;
        this.word = word;
    }

    toJSON() {
        return {
            start_time: this.start_time,
            end_time: this.end_time,
            word: this.word
        };
    }
}

class Lyric {
    constructor() {
        this.lyrics = [];
    }

    get_lyric(index) {
        if (index < 0 || index >= this.lyrics.length) {
            throw new Error("Lyric index out of bounds");
        }
        return this.lyrics[index];
    }

    get_lyric_slice(start, end = null) {
        // Handle negative indices for start and end
        const adjustedStart = start < 0 ? this.lyrics.length + start : start;
        const adjustedEnd =
            end === null || end === undefined
                ? this.lyrics.length // Default to the end of the array
                : end < 0
                    ? this.lyrics.length + end
                    : end;

        // Ensure indices are within bounds
        if (adjustedStart < 0 || adjustedStart >= this.lyrics.length ||
            adjustedEnd < 0 || adjustedEnd > this.lyrics.length) {
            throw new Error("Lyric slice indices out of bounds");
        }

        // Return sliced lyrics
        return this.lyrics.slice(adjustedStart, adjustedEnd);
    }

    // Update lyric at the specified index
    // lyric: 1D array of word objects
    set_lyric(index, lyric) {
        if (!Array.isArray(lyric) || !lyric.every(w => w instanceof Word)) {
            throw new Error("Invalid lyric format");
        }
        if (index < 0 || index >= this.lyrics.length) {
            throw new Error("Lyric index out of bounds");
        }
        this.lyrics[index] = lyric;
    }

    // Update lyric at the specified index
    // lyric: 1D array of word as json
    set_lyric_json(index, lyric) {
        let words = [];
        lyric.forEach(word => {
            words.push(new Word(word.start_time, word.end_time, word.word));
        })
        this.lyrics[index] = words;
    }

    append_lyric(lyric) {
        if (!Array.isArray(lyric) || !lyric.every(w => w instanceof Word)) {
            throw new Error("Invalid lyric format");
        }
        this.lyrics.push(lyric);
    }

    append_lyric_json(lyric) {
        let extend = [];
        let cur_sentence;
        lyric.forEach(sentence => {
            cur_sentence = [];
            sentence.forEach(word => {
                cur_sentence.push(new Word(word.start_time, word.end_time, word.word));
            });
            extend.push(cur_sentence); // 2D array
        });
        let inserted_index = this.lyrics.length;
        this.lyrics = [...this.lyrics, ...extend]; // 2D array
        return inserted_index;
    }

    prepend_lyric_json(lyric) {
        let extend = [];
        let cur_sentence;
        lyric.forEach(sentence => {
            cur_sentence = [];
            sentence.forEach(word => {
                cur_sentence.push(new Word(word.start_time, word.end_time, word.word));
            });
            extend.push(cur_sentence); // 2D array
        });
        let inserted_index = 0;
        this.lyrics = [...extend,...this.lyrics]; // 2D array
        return inserted_index;
    }

    delete_lyric(index) {
        if (index < 0 || index >= this.lyrics.length) {
            throw new Error("Lyric index out of bounds");
        }
        this.lyrics.splice(index, 1);
    }

    get_word(lyric_index, word_index) {
        if (lyric_index < 0 || lyric_index >= this.lyrics.length) {
            throw new Error("Lyric index out of bounds");
        }
        let lyric = this.lyrics[lyric_index];
        if (word_index < 0 || word_index >= lyric.length) {
            throw new Error("Word index out of bounds");
        }
        return lyric[word_index];
    }

    set_word(lyric_index, word_index, word) {
        if (!(word instanceof Word)) {
            throw new Error("Invalid word format");
        }
        if (lyric_index < 0 || lyric_index >= this.lyrics.length) {
            throw new Error("Lyric index out of bounds");
        }
        let lyric = this.lyrics[lyric_index];
        if (word_index < 0 || word_index >= lyric.length) {
            throw new Error("Word index out of bounds");
        }
        lyric[word_index] = word;
    }

    delete_word(lyric_index, word_index) {
        if (lyric_index < 0 || lyric_index >= this.lyrics.length) {
            throw new Error("Lyric index out of bounds");
        }
        let lyric = this.lyrics[lyric_index];
        if (word_index < 0 || word_index >= lyric.length) {
            throw new Error("Word index out of bounds");
        }
        lyric.splice(word_index, 1);
    }

    append_word(lyric_index, word) {
        if (!(word instanceof Word)) {
            throw new Error("Invalid word format");
        }
        if (lyric_index < 0 || lyric_index >= this.lyrics.length) {
            throw new Error("Lyric index out of bounds");
        }
        this.lyrics[lyric_index].push(word);
    }
    // insert a 2D array new lyric at the specified index
    insert_lyric_json(index, lyric) {
        let extend = [];
        let cur_sentence;
        lyric.forEach(sentence => {
            cur_sentence = [];
            sentence.forEach(word => {
                cur_sentence.push(new Word(word.start_time, word.end_time, word.word));
            });
            extend.unshift(cur_sentence); // 2D array
        });
        this.lyrics.splice(index, 0, ...extend);
        return index;
    }

    toJSON() {
        return this.lyrics.map(lyric => lyric.map(word => word.toJSON()));
    }
}