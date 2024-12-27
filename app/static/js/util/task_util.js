// cookie_util.js

const COOKIE_NAME = 'tasks';
const COOKIE_EXPIRY_DAYS = 7;

/**
 * Retrieves the list of tasks from the cookie.
 * @returns {Array} Array of task objects [{id, type, startTime}, ...]
 */
function getTasks() {
    const tasks = Cookies.get(COOKIE_NAME);
    return tasks ? JSON.parse(tasks) : [];
}

/**
 * Saves the list of tasks to the cookie.
 * @param {Array} tasks - Array of task objects
 */
function saveTasks(tasks) {
    Cookies.set(COOKIE_NAME, JSON.stringify(tasks), { expires: COOKIE_EXPIRY_DAYS });
}

/**
 * Adds a new task to the task list and saves it to the cookie.
 * @param {string} taskId - The ID of the task
 * @param {string} taskType - The type of the task
 */
function addTask(taskId, taskType) {
    const tasks = getTasks();
    const newTask = {
        id: taskId,
        type: taskType,
        startTime: Date.now()
    };
    tasks.push(newTask);
    saveTasks(tasks);
    return newTask;
}

/**
 * Removes a task from the task list by its ID and updates the cookie.
 * @param {string} taskId - The ID of the task to remove
 */
function removeTask(taskId) {
    let tasks = getTasks();
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasks(tasks);
}
