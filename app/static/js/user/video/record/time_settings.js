const start_minute_select = document.getElementById("start-minute-select");
const start_second_select = document.getElementById("start-second-select");
const end_minute_select = document.getElementById("end-minute-select");
const end_second_select = document.getElementById("end-second-select");
start_minute_select.addEventListener("change", updateStartTime);
start_second_select.addEventListener("change", updateStartTime);
end_minute_select.addEventListener("change", updateEndTime);
end_second_select.addEventListener("change", updateEndTime);
const start_time_display = document.getElementById("selected-start-time");
const end_time_display = document.getElementById("selected-end-time");
// Populate minutes and seconds
function populateTimeOptions() {
    for (let i = 0; i < 60; i++) {
        const startMinuteOption = document.createElement("option");
        startMinuteOption.value = i;
        startMinuteOption.textContent = i.toString().padStart(2, "0");
        start_minute_select.appendChild(startMinuteOption);

        const endMinuteOption = document.createElement("option");
        endMinuteOption.value = i;
        endMinuteOption.textContent = i.toString().padStart(2, "0");
        end_minute_select.appendChild(endMinuteOption);

        const startSecondOption = document.createElement("option");
        startSecondOption.value = i;
        startSecondOption.textContent = i.toString().padStart(2, "0");
        start_second_select.appendChild(startSecondOption);

        const endSecondOption = document.createElement("option");
        endSecondOption.value = i;
        endSecondOption.textContent = i.toString().padStart(2, "0");
        end_second_select.appendChild(endSecondOption);
    }
}
function updateStartTime() {
    let start_minute = start_minute_select.value.padStart(2, "0");
    let start_second = start_second_select.value.padStart(2, "0");
    start_time = (parseInt(start_minute, 10) * 60 + parseInt(start_second, 10)) * 1000;
    start_time_display.textContent = `Thời gian bắt đầu: ${start_minute}:${start_second}`;
}
function updateEndTime() {
    let end_minute = end_minute_select.value.padStart(2, "0");
    let end_second = end_second_select.value.padStart(2, "0");
    end_time = (parseInt(end_minute, 10) * 60 + parseInt(end_second, 10)) * 1000;
    end_time_display.textContent = `Thời gian kết thúc: ${end_minute}:${end_second}`;
}
function convertDuration(seconds) {
    const minutes = Math.floor(seconds / 60); // Whole minutes
    const remainingSeconds = Math.floor(seconds % 60); // Remaining seconds

    return { minutes, seconds: remainingSeconds }; // Return as an object
}