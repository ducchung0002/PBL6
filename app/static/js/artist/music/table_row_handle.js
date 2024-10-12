//--------------------------------------------------------------------------------------------------
// event when import lyric button in import lyric modal is clicked
$('#import-lyric-modal button[type="submit"]').on('click', function () {
    const $textarea = $('#import-lyric-json');
    const lyricText = $textarea.val();
    $textarea.val(''); // Clear the textarea

    let lyricJson = JSON.parse(lyricText)
    lyric.append_lyric_json(lyricJson);
    const rows = build_lyric_rows(lyricJson);

    lyricTableBody.append(rows); // Append the new sentence rows
    sentence_rows.push(...rows); // Append the new sentence rows

    update_total_pages(); // Update the total number of pages
    display_sentence_table(current_paging); // Display the first page of sentences
});

// add sentence button in lyrics table is clicked
$('#add-sentence-btn').on('click', function () {
    let dummy_lyric = [[dummy_word]]
    lyric.prepend_lyric_json(dummy_lyric);
    let rows = build_lyric_rows(dummy_lyric);

    lyricTableBody.prepend(rows); // prepend the new sentence rows
    sentence_rows.unshift(...rows); // prepend the new sentence rows

    update_total_pages(); // Update the total number of pages
    display_sentence_table(current_paging); // Display the first page of sentences

    // hide the MAX_SENTENCE_PER_PAGE th row
    if (sentence_rows.length > MAX_SENTENCE_PER_PAGE) {
        sentence_rows[MAX_SENTENCE_PER_PAGE].classList.add('d-none');
    }
})

// Handle the add sentence to new row button in the lyric table. Dynamic Elements
$(document).on('click', '[data-name="add-next-sentence-btn"]', function () {
    let current_row = $(this).closest('tr');
    let row_index = current_row.index(); // 0-based index
    let dummy_lyric = [[dummy_word]];
    let new_rows = build_lyric_rows(dummy_lyric);
    // add
    lyric.insert_lyric_json(row_index + 1, dummy_lyric); // Insert the new rows into the array
    current_row.after(new_rows); // Insert the new rows after the current one. update one row not render all rows.
    sentence_rows.splice(row_index + 1, 0, ...new_rows); // Insert the new rows into the array
    // update view
    update_total_pages(); // Update the total number of pages
    display_sentence_table(current_paging); // Display the first page of sentences
});

// Handle the add sentence to new row button in the lyric table. Dynamic Elements
$(document).on('click', '[data-name="delete-sentence-btn"]', function () {
    let current_row = $(this).closest('tr');
    let row_index = current_row.index(); // 0-based index
    // remove
    lyric.delete_lyric(row_index);
    sentence_rows.splice(row_index, 1); // remove the row from the array
    current_row.remove(); // Remove the row from the DOM
    // update view
    update_total_pages(); // Update the total number of pages
    display_sentence_table(current_paging); // Display the first page of sentences
});

// Handle the add word detail button in the sentence detail modal. Dynamic Elements
$(document).on('click', '.btn-add-word-row', function () {
    let current_row = $(this).closest('tr'); // Find the current row
    let newRow = build_sentence_rows([dummy_word]);
    // Insert the new row after the current one
    current_row.after(newRow);
});

// Handle the delete word detail button in the sentence detail modal. Dynamic Elements
$(document).on('click', '.btn-delete-word-row', function () {
    let currentRow = $(this).closest('tr'); // Find the current row

    // Prevent deletion if there's only one row
    if ($('#sentence-detail-table tbody tr').length > 1) {
        currentRow.remove();
    } else {
        alert('You cannot delete the last remaining row!');
    }
});

// update sentence row when word detail modal submit button click event
$('#sentence-detail-modal button[type="submit"]').click(function () {
    let data = []; // Initialize an empty array to store the extracted data

    // Loop through each row in the table body
    $('#sentence-detail-table tbody tr').each(function () {
        // Extract values from the input fields of the current row
        let word = $(this).find('input[name="word"]').val();
        let start_time = parseInt($(this).find('input[name="start_time"]').val());
        let end_time = parseInt($(this).find('input[name="end_time"]').val());

        // Push the object to the data array
        data.push({
            word: word,
            start_time: start_time,
            end_time: end_time
        });
    });

    // Update the lyric data
    lyric.set_lyric_json(current_row_index, data);
    // Update the sentece row in lyric table
    const nthRow = $(`#music-lyrics tr:nth-child(${current_row_index + 1})`);
    nthRow.find('td[data-name="lyric-text"]').text(data.map(item => item.word).join(' '));
    nthRow.find('td[data-name="start-time"]').text(data[0].start_time);
    nthRow.find('td[data-name="end-time"]').text(data[data.length - 1].end_time);
});

// event when show word detail modal button is clicked
$('#sentence-detail-modal').on('show.bs.modal', (event) => {
    const button = event.relatedTarget;
    let row = $(button).closest('tr');
    current_row_index = row.index(); // 0-based index
    let sentence_rows = build_sentence_rows(lyric.get_lyric(current_row_index));

    // Select the table body
    const sentenceDetailTableBody = sentence_detail_table.find('tbody');

    // Clear the table body
    sentenceDetailTableBody.empty();

    // Append new rows
    sentence_rows.forEach(row => {
        sentenceDetailTableBody.append(row);
    });
});

// previous lyric page button click event
$('#prev-lyric-page-btn').on('click', () => display_sentence_table(current_paging - 1));

// next lyric page button click event
$('#next-lyric-page-btn').on('click', () => display_sentence_table(current_paging + 1));

//--------------------------------------------------------------------------------------------------
// create a button to show sentence detail modal
function create_show_sentence_detail_modal_button() {
    return $(`
        <button type="button" data-bs-toggle="modal" data-bs-target="#sentence-detail-modal">
            <img src="/static/image/artist/music/information-circle.svg" width="30" alt="">
        </button>
    `);
}

// give a 2D array lyrics, build a list of rows for every sentence in the lyrics
function build_lyric_rows(lyrics) {
    let rows = [];
    lyrics.forEach((sentence) => {
        const lyricText = sentence.map(item => item.word).join(' ');
        const startTime = sentence[0].start_time;
        const endTime = sentence[sentence.length - 1].end_time;

        const mainRow = $('<tr class="d-none"></tr>');
        const modal_btn = $('<td></td>').append(create_show_sentence_detail_modal_button());

        mainRow.append(modal_btn);
        mainRow.append(`<td data-name="lyric-text" class="text-center align-middle">${lyricText}</td>`);
        mainRow.append(`<td data-name="start-time" class="text-center align-middle">${startTime}</td>`);
        mainRow.append(`<td data-name="end-time" class="text-center align-middle">${endTime}</td>`);
        mainRow.append(`<td data-name="add-next-sentence-btn" class="text-center align-middle"><button class="btn"><i class="bi bi-plus"></i></button></td>`);
        mainRow.append(`<td data-name="delete-sentence-btn" class="text-center align-middle"><button class="btn"><i class="bi bi-trash3"></i></button></td>`);

        rows.push(mainRow[0]);
    });
    return rows;
}

// give a 1D array sentence, build a list of rows for every word in the sentence
function build_sentence_rows(sentences) {
    let rows = [];
    sentences.forEach((word) => {

        const row = $('<tr></tr>');
        const startTimeInput = $(`<td><input type="text" name="start_time" value="${word.start_time}" maxlength="6"></td>`);
        const endTimeInput = $(`<td><input type="text" name="end_time" value="${word.end_time}" maxlength="6"></td>`);
        // Add an input event listener to restrict non-numeric characters
        startTimeInput.find('input').on('input', function () {
            this.value = this.value.replace(/[^0-9]/g, ''); // Allow only digits
            // If the value is empty, set it to '0'
            if (this.value === '') {
                this.value = '0';
            }
        });
        endTimeInput.find('input').on('input', function () {
            this.value = this.value.replace(/[^0-9]/g, ''); // Allow only digits
            // If the value is empty, set it to '0'
            if (this.value === '') {
                this.value = '0';
            }
        });
        row.append(`<td><input type="text" name="word" value="${word.word}" required></td>`);
        row.append(startTimeInput);
        row.append(endTimeInput);
        row.append(`<td><button class="btn btn-add-word-row"><i class="bi bi-plus"></i></button></td>`);
        row.append(`<td><button class="btn btn-delete-word-row"><i class="bi bi-trash3"></i></button></td>`);

        rows.push(row[0]);
    });

    return rows;
}

// function to display a specific page of sentences
function display_sentence_table(page /*1-based index*/) {
    if (page < 1 || page > total_pages) return;

    const startIndex = (page - 1) * MAX_SENTENCE_PER_PAGE;
    const endIndex = Math.min(startIndex + MAX_SENTENCE_PER_PAGE, sentence_rows.length);

    let startHidden = (current_paging - 1) * MAX_SENTENCE_PER_PAGE;
    let endHidden = Math.min(startHidden + MAX_SENTENCE_PER_PAGE, sentence_rows.length);

    sentence_rows.slice(startHidden, endHidden).forEach(row => {
        row.classList.add('d-none');
    });

    // show the sentences for the current page
    sentence_rows.slice(startIndex, endIndex).forEach(row => {
        row.classList.remove('d-none');
    });

    // update the current page number
    $('#current-lyric-page').text(page);
    // update current_paging
    current_paging = page;
}

// update the total number of pages
function update_total_pages() {
    total_pages = Math.ceil(sentence_rows.length / MAX_SENTENCE_PER_PAGE);
    if (total_pages < 1) {
        total_pages = 1;
    }
    $('#total-lyric-page').text(total_pages);
}