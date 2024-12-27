const $feat_artists_dropdown = $("#feat-artists-dropdown");
const $selected_feat_artists = $("#selected-feat-artists");
let query_artists = [];
const feat_artists = [currentUser.id];
const $feat_artists_query = $("#feat_artists_query");

const button_debouncing = (func, delay) => {
    let debounceTimer;
    return function (...args) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(this, args), delay);
    };
};

const searchFeatArtists = () => {
    const query = $feat_artists_query.val().trim().toLowerCase();
    socket.emit("search feat artists", query);
};

// Attach event listeners
$feat_artists_query.on("input", button_debouncing(searchFeatArtists, 300));
$feat_artists_query.on("click", () => {
    if (!$feat_artists_dropdown.is(":visible")) // is hidden
        render_feat_artists_dropdown();
    else $feat_artists_dropdown.hide();
});

socket.on('feat artists found', (artists) => {
    $feat_artists_dropdown.empty();
    query_artists = artists;
    render_feat_artists_dropdown();
});

$feat_artists_dropdown.on("click", "li", function () {
    $feat_artists_dropdown.hide();
    const artist_name = $(this).text();
    const artist_id = $(this).data('id')
    feat_artists.push(artist_id);
    const $artistTag = $('<span>')
        .addClass('badge bg-primary me-2 mb-2')
        .html(`${artist_name}<i class="fas fa-times ms-1" role="button"></i>`)
        .attr('data-genre-id', artist_id);
    $selected_feat_artists.append($artistTag);

    // remove from selected
    $artistTag.find('i').on('click', function () {
        const $parent_tag = $(this).parent();
        const artist_id = $parent_tag.data('id');

        // Remove from selected list
        $parent_tag.remove();
        feat_artists.splice(feat_artists.indexOf(artist_id), 1);
    });
});

$selected_feat_artists.on("click", "[data-value]", function () {
    $(this).parent().remove();
});

function render_feat_artists_dropdown() {
    $feat_artists_dropdown.empty();
    let include_count = query_artists.length;
    query_artists.forEach(artist => {
        if (!feat_artists.includes(artist.id)) {
            $feat_artists_dropdown.append(`<li class="dropdown-item" data-id="${artist.id}">${artist.nickname} (${artist.name})</li>`)
            include_count--;
        }
    });

    if (include_count !== query_artists.length)
        $feat_artists_dropdown.show();
    if (query_artists.length === 0)
        $feat_artists_dropdown.hide();
}