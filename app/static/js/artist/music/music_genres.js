// event for genre dropdown
const $genre_dropdown = $('#genres-dropdown');
const $selectedGenresContainer = $('#selected-genres');
const selected_genres = [];
// Event for genre dropdown
$genre_dropdown.on('click', '.dropdown-item', function (e) {
    e.preventDefault();
    e.stopPropagation();
    const $this = $(this);
    const genreId = $this.data('genre-id');
    const genreName = $this.text();
    selected_genres.push(genreId);

    // Add genre to selected list
    const $genreTag = $('<span>')
        .addClass('badge bg-primary me-2 mb-2')
        .html(`${genreName} <i class="fas fa-times ms-1" role="button"></i>`)
        .attr('data-genre-id', genreId);

    $selectedGenresContainer.append($genreTag);

    // Remove from dropdown
    $this.parent().remove();

    // Add delete functionality
    $genreTag.find('i').on('click', function () {
        const $parentTag = $(this).parent();
        const genreId = $parentTag.data('genre-id');
        const genreName = $parentTag.text().trim();

        // Add back to dropdown
        const $newDropdownItem = $('<li>')
            .html(`<a class="dropdown-item dropdown-genre" href="#" data-genre-id="${genreId}">${genreName}</a>`);
        $genre_dropdown.append($newDropdownItem);

        // Remove from selected list
        $parentTag.remove();
        selected_genres.splice(selected_genres.indexOf(genreId), 1);
    });
});
