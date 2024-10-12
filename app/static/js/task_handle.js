const TASK_POLLING_INTERVAL = 3000; // 3 seconds
const TASK_POLLING_TIMEOUT = 60000; // 60 seconds
const TASK_TYPES = {
    ARTIST_UPLOAD_MUSIC: 'artist upload music',
}
const TASK_FAIL_TYPES = {
    UPLOAD_MUSIC_AUDIO: 'music audio',
    UPLOAD_MUSIC_KARAOKE: 'music karaoke',
    UPLOAD_MUSIC_THUMBNAIL: 'music thumbnail',
    SAVE_ERROR: 'save error'
}

/**
 * Handles completion of upload music tasks.
 * @param {string} taskId - The ID of the completed task
 */
function handleUploadMusicComplete(result) {
    if (result?.music_id) {
        Swal.fire({
            icon: "success",
            title: "Đăng tải nhạc thành công!",
            confirmButtonText: 'OK',
            footer: `<a href="/music/${result.music_id}">Bài hát của bạn</a>`
        });
    }
    else if (result?.fail_type === TASK_FAIL_TYPES.UPLOAD_MUSIC_AUDIO)
        Swal.fire({
            icon: "error",
            title: "Lỗi đăng tải file âm thanh",
            text: "Đăng tải file âm thanh thất bại",
            footer: result.detail,
            confirmButtonText: 'OK',
        });
    else if (result?.fail_type === TASK_FAIL_TYPES.UPLOAD_MUSIC_KARAOKE)
        Swal.fire({
            icon: "error",
            title: "Lỗi đăng tải file âm thanh",
            text: "Đăng tải file karaoke thất bại",
            footer: result.detail,
            confirmButtonText: 'OK',
        });
    else if (result?.fail_type === TASK_FAIL_TYPES.UPLOAD_MUSIC_THUMBNAIL)
        Swal.fire({
            icon: "error",
            title: "Lỗi đăng tải thumbnail",
            text: "Đăng tải thumbnail thất bại",
            footer: result.detail,
            confirmButtonText: 'OK',
        });
    else if (result?.fail_type === TASK_FAIL_TYPES.SAVE_ERROR)
        Swal.fire({
            icon: "error",
            title: "Lỗi đăng tải bài hát",
            text: "Đăng tải bài hát thất bại, vui lòng thử lại",
            footer: data.detail,
            confirmButtonText: 'OK',
        });
}

/**
 * Fetches the status of a given task from the server.
 * @param {Object} task - The task object containing id and type
 */
async function fetchTaskStatus(task) {
    try {
        const response = await axios.get(`/api/task/${task.id}`);
        // console.log(response.data);
        const state = response.data.state;

        if (state === 'SUCCESS' || state === 'failed') {
            removeTask(task.id);
            clearInterval(task.pollingInterval);

            if (task.type === TASK_TYPES.ARTIST_UPLOAD_MUSIC) {
                handleUploadMusicComplete(response.data.result);
            }
        }
    } catch (error) {
        console.error(`Error fetching status for task ${task.id}:`, error);
        removeTask(task.id);
        clearInterval(task.pollingInterval);
    }
}

/**
 * Starts polling for the status of a task.
 * @param {Object} task - The task object containing id, type, and startTime
 */
function pollTask(task) {
    task.pollingInterval = setInterval(() => {
        const elapsed = Date.now() - task.startTime;

        if (elapsed > TASK_POLLING_TIMEOUT) {
            clearInterval(task.pollingInterval);
            removeTask(task.id);
            console.log(`Task ${task.id} timed out and was removed.`);
            return;
        }

        fetchTaskStatus(task);
    }, TASK_POLLING_INTERVAL);
}

/**
 * Initializes polling for all tasks stored in the cookie.
 */
function initializePolling() {
    const tasks = getTasks();

    tasks.forEach(task => {
        const elapsed = Date.now() - task.startTime;

        if (elapsed < TASK_POLLING_TIMEOUT) {
            pollTask(task);
        } else {
            removeTask(task.id);
            console.log(`Task ${task.id} has already timed out and was removed.`);
        }
    });
}

/**
 * Handles the response after uploading a file.
 * @param {string} task_id - The task id of the uploaded file
 * @param {string} taskType - The type of the task
 */
function handleTaskResponse(task_id, taskType) {
    const taskId = task_id;
    if (taskId) {
        const task = addTask(taskId, taskType);
        pollTask(task);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize polling for existing tasks
    initializePolling();
});