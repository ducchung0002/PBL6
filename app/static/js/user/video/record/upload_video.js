function uploadRecordedVideo(){
    const title = document.getElementById('video-title').value;

    let music_id;
    if (!music){
        alert('Vui lòng chọn bài hát trước khi ghi hình.');
        return;
    }
    else{
        music_id = music.id;
    }

    if (!title) {
        alert('Vui lòng nhập tiêu đề trước khi ghi hình.');
        return;
    }

    if (recorded_blobs.length === 0) {
        alert('Không có video nào được ghi.');
        return;
    }

    const blob = new Blob(recorded_blobs, { type: 'video/webm' });
    const form_data = new FormData();
    const music_start = start_time;
    const music_end = end_time;

    form_data.append('video', blob, 'recorded-video.webm');
    form_data.append('title', title);
    form_data.append('music_id', music_id);
    form_data.append('music_start', music_start);
    form_data.append('music_end', music_end);

    axios.post(`/api/user/video/record`, form_data)
        .then(response => {
            if (response.status !== 200 && response.status !== 201) {
                alert('Có lỗi xảy ra khi đăng video: ' + response.error);
            }
            return response.data;
        })
        .then(data => {
            alert('Video đã được xử lý và đăng thành công',"success");
        })
        .catch(error => {
            alert('Có lỗi xảy ra khi đăng video: ' + error.message);
        });
}