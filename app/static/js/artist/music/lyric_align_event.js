$(document).ready(() => {
    const $alignLyricModal = new bootstrap.Modal($('#lyrics-alignment-submit-modal')[0]);
    const $regionsLyric = $('#regions-lyric');
    const $alignLyricText = $('#align-lyric-response');
    const $copyButton = $('#copy-align-btn');
    const copyTooltip = new bootstrap.Tooltip($copyButton[0]);

    // Open modal on button click
    $('button[data-bs-target="#lyrics-alignment-submit-modal"]').on('click', function () {
        if (!activeRegion) {
            Swal.fire({
                icon: "error",
                title: "Chưa chọn vùng",
                text: "Chọn một vùng để đánh dấu căn chỉnh!",
            });
        } else {
            let startTime = activeRegion.start;
            let endTime = activeRegion.end;
            if (endTime - startTime > 60) {
                Swal.fire({
                    icon: "error",
                    title: "Vùng quá lớn",
                    text: "Vùng đánh dấu quá 60s, vui lòng chọn lại!",
                });
                return;
            }
            $alignLyricModal.show();
        }
    });

    // Align Submit Button Click
    $('#align-lyrics-submit-btn').on('click', async function () {
        if (activeRegion) {
            const $button = $(this);
            let text = $button.text();
            $button.html('<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Đang xử lý');
            $button.prop('disabled', true); // Disable the button to prevent multiple clicks

            let startTime = activeRegion.start;
            let endTime = activeRegion.end;

            try {
                let lyric = $regionsLyric.val();
                // Trim the audio
                const audioBlob = await trimAudio(audioUrl, startTime, endTime);

                // Prepare FormData
                const formData = new FormData();
                formData.append('file', audioBlob, 'audio.wav');
                formData.append('lyric', lyric);
                formData.append('start_time', Math.round(startTime * 1000).toString());

                // POST to the server using Axios
                axios.post(SERVER_LYRIC_ALIGN, formData, {headers: {'Content-Type': 'multipart/form-data',}})
                    .then((response) => {
                        $alignLyricText.val(JSON.stringify(response.data, null, 2));
                    })
                    .catch((error) => {
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
                    })
                    .finally(() => {
                        $button.html(text); // Change to original button text
                        $button.prop('disabled', false);
                    });
            } catch (error) {
                console.error('Error trimming or posting audio:', error);
            }
        }
    });

    // Copy Button Click
    $copyButton.on('click', function () {
        navigator.clipboard.writeText($alignLyricText.val())
            .then(() => {
                $copyButton.attr("data-bs-original-title", "sao chép thành công");
                copyTooltip.show();
                setTimeout(() => {
                    $copyButton.attr("data-bs-original-title", "Nhấn để sao chép");
                    copyTooltip.hide();
                }, 2000);
            })
            .catch((err) => {
                console.error("Failed to copy: ", err);
            });
    });
});
