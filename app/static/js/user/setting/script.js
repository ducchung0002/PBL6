document.addEventListener('DOMContentLoaded', function() {
    const updateAccountButton = document.getElementById('updateAccountButton');
    const updateAccountButtonText = document.getElementById('updateAccountButtonText');
    const updateAccountButtonSpinner = document.getElementById('updateAccountButtonSpinner');
    const successAccountModal = new bootstrap.Modal(document.getElementById('successAccountModal'));

    // Lấy user.id từ input ẩn
    const userId = document.getElementById('user_id').value;

    // Lấy CSRF token
    const csrfToken = document.getElementById('csrf_token_account').value;

    updateAccountButton.addEventListener('click', function() {
        // Thu thập dữ liệu từ các trường nhập liệu
        const email = document.getElementById('email').value;
        const username = document.getElementById('username').value;
        const publicProfile = document.getElementById('public_profile').checked;
        // Loại bỏ các trường không tồn tại hoặc thêm chúng vào nếu bạn đã thêm trong HTML

        // Tạo một FormData để gửi dữ liệu
        const formData = new FormData();
        formData.append('id', userId);
        formData.append('name', username);
        formData.append('email', email);
        formData.append('public_profile', publicProfile);
        // Thêm các trường khác nếu cần

        // Hiển thị Spinner và vô hiệu hóa nút
        updateAccountButtonSpinner.classList.remove('d-none');
        updateAccountButton.disabled = true;
        // Đổi văn bản nút
        updateAccountButtonText.textContent = 'Đang cập nhật...';

        // Gửi dữ liệu đến backend bằng Fetch API
        fetch('/api/user/profile/update', {
            method: 'PUT',
            headers: {
                'X-CSRFToken': csrfToken  // Thêm CSRF token vào headers
            },
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                setTimeout(function() {
                    // Ẩn Spinner và bật lại nút
                    updateAccountButtonSpinner.classList.add('d-none');
                    updateAccountButton.disabled = false;
                    // Đổi văn bản nút trở lại
                    updateAccountButtonText.textContent = 'Cập nhật';

                    if (data.message === 'User profile updated successfully') {
                        // Hiển thị Modal thông báo thành công
                        successAccountModal.show();
                    } else {
                        // Hiển thị thông báo lỗi
                        alert(data.message || 'Có lỗi xảy ra khi cập nhật tài khoản.');
                    }
                }, 2500);
            })
            .catch(error => {
                console.error('Error:', error);
                // Ẩn Spinner và bật lại nút
                updateAccountButtonSpinner.classList.add('d-none');
                updateAccountButton.disabled = false;
                // Đổi văn bản nút trở lại
                updateAccountButtonText.textContent = 'Cập nhật';

                // Hiển thị thông báo lỗi
                alert('Có lỗi xảy ra khi cập nhật tài khoản.');
            });
    });
    const updatePrivacyButton = document.getElementById("updatePrivacyButton");
    const updatePrivacyButtonText = document.getElementById("updatePrivacyButtonText");
    const updatePrivacyButtonSpinner = document.getElementById("updatePrivacyButtonSpinner");
    const successPrivacyModal = new bootstrap.Modal(document.getElementById("successPrivacyModal"));

    updatePrivacyButton.addEventListener("click", function () {
        // Thu thập dữ liệu từ các trường nhập liệu (nếu cần)
        const privateSubscriptions = document.getElementById("privateSubscriptions").checked;

        // Hiển thị Spinner và vô hiệu hóa nút
        updatePrivacyButtonSpinner.classList.remove("d-none");
        updatePrivacyButton.disabled = true;
        // Đổi văn bản nút
        updatePrivacyButtonText.textContent = "Đang lưu...";

        // Thêm độ trễ 2.5 giây trước khi hiển thị modal
        setTimeout(function () {
            // Ẩn Spinner và bật lại nút
            updatePrivacyButtonSpinner.classList.add("d-none");
            updatePrivacyButton.disabled = false;
            // Đổi văn bản nút trở lại
            updatePrivacyButtonText.textContent = "Lưu thay đổi";

            // Hiển thị Modal thông báo thành công
            successPrivacyModal.show();
        }, 2500); // 2500ms tương đương 2.5 giây
    });
    const updatePlaybackButton = document.getElementById("updatePlaybackButton");
    const updatePlaybackButtonText = document.getElementById("updatePlaybackButtonText");
    const updatePlaybackButtonSpinner = document.getElementById("updatePlaybackButtonSpinner");
    const successPlaybackModal = new bootstrap.Modal(document.getElementById("successPlaybackModal"));

    updatePlaybackButton.addEventListener("click", function () {
        // Thu thập dữ liệu từ các trường nhập liệu
        const showInfoCards = document.getElementById("showInfoCards").checked;
        const alwaysShowCaptions = document.getElementById("alwaysShowCaptions").checked;
        const includeAutoGenerated = document.getElementById("includeAutoGenerated").checked;
        const av1SettingElement = document.querySelector('input[name="av1Setting"]:checked');
        const av1Setting = av1SettingElement ? av1SettingElement.value : 'auto';
        const videoPreview = document.getElementById("videoPreview").checked;

        // Kiểm tra dữ liệu đã thu thập (tùy chọn)
        console.log({
            showInfoCards,
            alwaysShowCaptions,
            includeAutoGenerated,
            av1Setting,
            videoPreview
        });

        // Hiển thị Spinner và vô hiệu hóa nút
        updatePlaybackButtonSpinner.classList.remove("d-none");
        updatePlaybackButton.disabled = true;
        updatePlaybackButtonText.textContent = "Đang lưu...";

        // Thêm độ trễ 2.5 giây trước khi hiển thị modal
        setTimeout(function () {
            // Ẩn Spinner và bật lại nút
            updatePlaybackButtonSpinner.classList.add("d-none");
            updatePlaybackButton.disabled = false;
            updatePlaybackButtonText.textContent = "Lưu thay đổi";

            // Hiển thị Modal thông báo thành công
            successPlaybackModal.show();
        }, 2500);
    });
});