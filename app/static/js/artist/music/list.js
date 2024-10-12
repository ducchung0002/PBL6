$(document).ready(function () {
    // Select all buttons with the class 'update-music-btn'
    $('.update-music-btn').on('click', function () {
        // Get the genre values from the button's data attributes
        let musicId = $(this).data('id');
        let musicName = $(this).data('name');
        let musicArtists = $(this).data('artists');
        let musicLyrics = $(this).data('lyrics');

        // Now populate the modal's form fields
        let modal = $('#update-music-modal');
        modal.find('#update-music-id').val(musicId);
        modal.find('#update-music-name').val(musicName);
        modal.find('#update-music-artists').val(musicArtists);
        modal.find('#update-music-lyrics').val(musicLyrics);
    });

    // Select all buttons with the class 'delete-music-btn'
    $('.delete-music-btn').on('click', function () {
        let musicId = $(this).data('id');
        let modal = $('#delete-music-modal');
        modal.find('#delete-music-id').val(musicId);
    });
});
