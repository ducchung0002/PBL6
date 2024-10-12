// submit add music
$('#add-music-btn').on('click', function () {
    if ($('#music-name').val().trim() === "") {
        Swal.fire({
            icon: 'error',
            title: 'Nhập tên bài hát!',
            confirmButtonText: 'OK'
        })
        return;
    }

    if (selected_genres.length === 0) {
        Swal.fire({
            icon: 'error',
            title: 'Chọn ít nhất một thể loại!',
            confirmButtonText: 'OK'
        })
        return;
    }

    if (!karaoke_file) {
        Swal.fire({
            icon: 'error',
            title: 'Hãy đăng tải file karaoke!',
            confirmButtonText: 'OK'
        })
    }

    let formData = new FormData();
    formData.append('lyrics', new Blob([JSON.stringify(lyric.toJSON())], {type: "application/json"}));
    formData.append('name', $('#music-name').val().trim());
    formData.append("artists", new Blob([JSON.stringify(feat_artists)], {type: "application/json"}));
    formData.append("genres", new Blob([JSON.stringify(selected_genres)], {type: "application/json"}));
    formData.append('audio', audio_file);
    formData.append('karaoke', karaoke_file);
    formData.append('thumbnail', thumbnail_file);

    const $button = $(this);
    $button.html('<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Đang đăng tải...');
    $button.prop('disabled', true); // Disable the button to prevent multiple clicks


    axios.post('/api/artist/music/add', formData, {
        headers: {"Content-Type": "multipart/form-data",},
    }).then((response) => {
        handleTaskResponse(response.data.task_id, TASK_TYPES.ARTIST_UPLOAD_MUSIC);
        Swal.fire({
            icon: "info",
            title: "Chúng tôi đang tải nhạc lên, vui lòng chờ đợi ít phút!",
            confirmButtonText: 'OK'
        });
    }).catch((error) => {
        if (error.response) {
            console.error("Error Data:", error.response.data);
            console.error("Status Code:", error.response.status);
        } else {
            console.error("Error:", error.message);
            Swal.fire({
                icon: "error",
                title: "Network Error",
                text: 'Kiểm tra kết nối mạng',
            });
        }
    });
});