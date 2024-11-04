function renderComment(comment, mode = 'comment', grandCommentId = null) {
    let li = document.createElement('li');
    li.classList.add('mb-3', 'd-flex', 'flex-column');
    li.setAttribute('data-comment-id', comment.id);

    // Phần chứa avatar, tên người dùng và nội dung bình luận
    let commentContentDiv = document.createElement('div');
    commentContentDiv.classList.add('d-flex', 'align-items-center');

    // Left side: avatar, name, content
    const leftDiv = document.createElement('div');
    leftDiv.classList.add('d-flex', 'align-items-center');

    // Thêm avatar
    let avatar = document.createElement('img');
    avatar.src = comment.user.avatar_url || '/path/to/default/avatar.png';
    avatar.alt = 'User Avatar';
    avatar.classList.add('rounded-circle', 'me-2');
    avatar.style.width = '32px';
    avatar.style.height = '32px';
    commentContentDiv.appendChild(avatar);

    // Thêm tên người dùng và nội dung bình luận
    const commentDetails = document.createElement('div');
    commentDetails.classList.add('flex-grow-1');

    const userName = document.createElement('strong');
    if (mode === 'comment') {
        userName.innerHTML = `<a href="/user/profile/${comment.user.id}" class="text-decoration-none text-body">${comment.user.name}</a>`;
    } else {
        userName.innerHTML = `
        <a href="/user/profile/${comment.user.id}" class="text-decoration-none text-body">${comment.user.name}</a>
        <i class="bi bi-caret-right-fill"></i>
        <a href="/user/profile/${comment.father_comment_user.id}" class="text-decoration-none text-body">${comment.father_comment_user.name}</a>
        `;
    }
    commentDetails.appendChild(userName);

    const commentContent = document.createElement('p');
    commentContent.classList.add('mb-1');
    commentContent.innerText = comment.content;
    commentDetails.appendChild(commentContent);

    commentContentDiv.appendChild(commentDetails);

    // Nút menu ba chấm (Dropdown)

    const dropdownDiv = document.createElement('div');
    dropdownDiv.classList.add('dropdown');


    const dropdownButton = document.createElement('button');
    // dropdownButton.classList.add('btn', 'btn-link', 'dropdown-toggle', 'text-decoration-none', 'text-muted', 'p-0');
    dropdownButton.classList.add('btn', 'dropdown-toggle');
    dropdownButton.setAttribute('type', 'button');
    dropdownButton.setAttribute('data-bs-toggle', 'dropdown');
    dropdownButton.setAttribute('aria-expanded', 'false');
    dropdownButton.setAttribute('data-toggle', 'dropdown');
    dropdownButton.innerHTML = '<i class="bi bi-three-dots-vertical"></i>';
    dropdownDiv.appendChild(dropdownButton);

    const dropdownMenu = document.createElement('ul');
    dropdownMenu.classList.add('dropdown-menu');

    if (sessionUser.id === comment.user.id) {
        // Mục "Chỉnh sửa"
        // Tạo phần tử "Chỉnh sửa" cho menu

        const editItem = document.createElement('li');
        const editButton = document.createElement('button');
        editButton.classList.add('dropdown-item', 'd-flex', 'align-items-center');
        editButton.innerHTML = '<i class="bi bi-pencil me-2"></i> Chỉnh sửa';
        editButton.onclick = function (e) {
            e.preventDefault();
            e.stopPropagation();
            editComment(comment.id);
        };
        editItem.appendChild(editButton);
        dropdownMenu.appendChild(editItem);

        // Mục "Xóa"
        const deleteItem = document.createElement('li');
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('dropdown-item', 'd-flex', 'align-items-center', 'text-danger');
        deleteButton.innerHTML = '<i class="bi bi-trash me-2"></i> Xóa bình luận';
        deleteButton.onclick = function (e) {
            e.preventDefault();
            e.stopPropagation();
            deleteComment(comment.id);
        };
        deleteItem.appendChild(deleteButton);
        dropdownMenu.appendChild(deleteItem);

    } else {
        // Mục "Report" cho bình luận của người khác
        const reportItem = document.createElement('li');
        const reportButton = document.createElement('button');
        reportButton.classList.add('dropdown-item', 'd-flex', 'align-items-center');
        reportButton.innerHTML = '<i class="bi bi-flag me-2"></i> Report';
        reportButton.onclick = function (e) {
            e.preventDefault();
            e.stopPropagation();
            reportComment(comment.id);
        };
        reportItem.appendChild(reportButton);
        dropdownMenu.appendChild(reportItem);

    }

    // Thêm dòng này để thêm dropdownMenu vào dropdownDiv
    dropdownDiv.appendChild(dropdownMenu);

    // Thêm dropdownDiv vào phần tử chứa bình luận
    commentContentDiv.appendChild(dropdownDiv);
    new bootstrap.Dropdown(dropdownButton);

    li.appendChild(commentContentDiv);

    // Container cho các nút like, dislike, và phản hồi
    const actionContainer = document.createElement('div');
    actionContainer.classList.add('d-flex', 'align-items-center', 'mt-1');

    // Button Like
    const likeButton = document.createElement('button');
    likeButton.classList.add('icon-button', 'me-2', 'btn', 'btn-light', 'btn-sm');
    likeButton.onclick = () => likeComment(comment.id);
    likeButton.innerHTML = `<i class="bi bi-hand-thumbs-up"></i> <span>${comment.like_count || 0}</span>`;
    actionContainer.appendChild(likeButton);

    // Button Dislike
    const dislikeButton = document.createElement('button');
    dislikeButton.classList.add('icon-button', 'me-2', 'btn', 'btn-light', 'btn-sm');
    dislikeButton.onclick = () => dislikeComment(comment.id);
    dislikeButton.innerHTML = `<i class="bi bi-hand-thumbs-down"></i> <span>${comment.dislike_count || 0}</span>`;
    actionContainer.appendChild(dislikeButton);

    // Button Phản hồi
    const replyButton = document.createElement('button');
    replyButton.classList.add('icon-button', 'btn', 'btn-light', 'btn-sm');
    replyButton.onclick = () => toggleReplySection(comment.id);
    replyButton.innerHTML = `<i class="bi bi-reply"></i> Phản hồi`;
    actionContainer.appendChild(replyButton);

    li.appendChild(actionContainer);

    // Khu vực nhập phản hồi (ẩn ban đầu)
    const replySection = document.createElement('div');
    replySection.id = `reply-section-${comment.id}`;
    replySection.classList.add('d-none', 'mt-2');

    const replyInput = document.createElement('input');
    replyInput.type = 'text';
    replyInput.classList.add('form-control');
    replyInput.placeholder = 'Nhập phản hồi...';
    replySection.appendChild(replyInput);

    const replySubmitButton = document.createElement('button');
    replySubmitButton.classList.add('btn', 'btn-primary', 'btn-sm', 'mt-1');
    replySubmitButton.innerText = 'Gửi';
    if (mode === 'comment') {
        replySubmitButton.onclick = () => submitReply(replyInput, comment.id, comment.id, comment.user);
    } else {
        replySubmitButton.onclick = () => submitReply(replyInput, comment.id, grandCommentId, comment.user);
    }
    replySection.appendChild(replySubmitButton);

    li.appendChild(replySection);

    if (mode === 'comment') {
        // view more replies
        if (comment.child_count > 0) {
            // Container for replies
            const repliesContainer = document.createElement('ul');
            repliesContainer.classList.add('list-unstyled', 'ms-4', 'mt-2');
            repliesContainer.id = `replies-container-${comment.id}`;
            li.appendChild(repliesContainer);
            // View replies button
            const viewRepliesButton = document.createElement('div');
            viewRepliesButton.classList.add('btn', 'text-decoration-none', 'text-muted', 'p-0', 'd-flex', 'align-items-center', 'mt-1');
            viewRepliesButton.setAttribute('data-comment-id', comment.id);
            viewRepliesButton.setAttribute('data-reply-skip', '0');
            viewRepliesButton.setAttribute('data-child-count', comment.child_count);
            viewRepliesButton.innerText = `Xem thêm ${comment.child_count} bình luận`;
            viewRepliesButton.onclick = () => viewReplies(event);
            li.appendChild(viewRepliesButton);
        }
    }

    return li;
}