document.addEventListener('DOMContentLoaded', function () {
    const dropdownButton = document.getElementById('dropdownButton');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const content = document.getElementById('content');
    const contentWrapper = document.getElementById('content-wrapper');
    const search_bar = document.getElementById("search_bar");
    // Emit search query to the server
    const sendSearchQuery = debounce((query) => {
        if (query.trim() === "") {
            clearRecommendations();
        }
        else{
            socket.emit("search", query);
        }
    }, 100); // Adjust delay as needed (e.g., 300ms)
    // Add input event listener
    search_bar.addEventListener("input", () => {
        const query = search_bar.value;
        if (query.trim() === "") {
            clearRecommendations();
        }
        sendSearchQuery(query);
    });
    search_bar.addEventListener("keypress", function(event) {
        // If the user presses the "Enter" key on the keyboard
        if (event.key === "Enter") {
            // Cancel the default action, if needed
            event.preventDefault();
            const query = search_bar.value;
            console.log("Search query sent: " + query);
            if (query.trim() === "") {
                clearRecommendations();
            }
            else{
                window.location = "/search?q=" + encodeURIComponent(query);
            }
        }
    });
    search_bar.addEventListener("blur", () => {
        // Delay clearing to allow click events on recommendations to register
        setTimeout(() => {
            clearRecommendations();
        }, 100);
    });
    // Handle search results from server
    socket.on("search_results", (results) => {
        var music_results=results["musics"]
        var name_results=results["names"]
        displayRecommendations(music_results,name_results)
    });
    if (dropdownButton) {
        dropdownButton.addEventListener('click', function () {
            dropdownMenu.classList.toggle('d-none');
        });

        document.addEventListener('click', function (event) {
            if (!dropdownButton.contains(event.target) && !dropdownMenu.contains(event.target)) {
                dropdownMenu.classList.add('d-none');
            }
        });
    }

    if (sidebarToggle && sidebar && content && contentWrapper) {
        sidebarToggle.addEventListener('click', toggleSidebar);
    }
});

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const content = document.getElementById('content');
    const contentWrapper = document.getElementById('content-wrapper');

    sidebar.classList.toggle('collapsed');
    content.classList.toggle('expanded');
    contentWrapper.classList.toggle('expanded');
}

function voice() {
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
        var recognition = new SpeechRecognition();
        recognition.lang = 'vi-VN';
        recognition.onresult = function (event) {
            console.log(event);
            console.log(event.results[0][0].transcript);
            document.getElementById("search_bar").value = event.results[0][0].transcript;
        }
        recognition.start();
    } else {
        console.log("Speech recognition not supported in this browser.");
    }
}
function displayRecommendations(music_recommendations, name_recommendations) {
    const recommendationsContainer = document.getElementById("search_recommendations");
    recommendationsContainer.innerHTML = "";

    if (music_recommendations.length === 0 && name_recommendations.length === 0) {
        clearRecommendations();
        return;
    }
    recommendationsContainer.style.display = "block";
    music_recommendations.forEach(item => {
        const music_recommendation_item = document.createElement("div");
        music_recommendation_item.textContent = item.name; // Adjust as per your API response
        music_recommendation_item.className = "px-3 py-2"; // Bootstrap utility classes
        music_recommendation_item.style.cursor = "pointer";
        music_recommendation_item.href = "/music/" + item.id;

        // Add hover effect
        music_recommendation_item.addEventListener("mouseover", () => {
            music_recommendation_item.style.backgroundColor = "#f8f9fa"; // Light grey
        });
        music_recommendation_item.addEventListener("mouseout", () => {
            music_recommendation_item.style.backgroundColor = "transparent";
        });

        // Handle click to populate input
        music_recommendation_item.addEventListener("click", function () {
            document.getElementById("search_bar").value = item.name; // Adjust based on your API data
            window.location.href = music_recommendation_item.href;
            clearRecommendations();
        });

        recommendationsContainer.appendChild(music_recommendation_item);
    });
    if (name_recommendations.length > 0) {
        const name_recommendation_header = document.createElement("h4");
        name_recommendation_header.textContent = "Names";
        name_recommendation_header.className = "px-3 py-2"; // Bootstrap utility classes
        recommendationsContainer.appendChild(name_recommendation_header);
        name_recommendations.forEach(item => {
            const name_recommendation_item = document.createElement("div");
            name_recommendation_item.href = "/user/profile/home/" + item.id; // Adjust based on your API data
            name_recommendation_item.textContent = (item.flag === 'artist') ? item.nickname : item.name; // Adjust as per your API response
            name_recommendation_item.className = "px-3 py-2"; // Bootstrap utility classes
            name_recommendation_item.style.cursor = "pointer";
            name_recommendation_item.addEventListener("click", function () {
                document.getElementById("search_bar").value = item.name;
                window.location.href = name_recommendation_item.href; // Redirect to user profile page
                clearRecommendations();
            })
            recommendationsContainer.appendChild(name_recommendation_item);
        });
        }
}
function clearRecommendations() {
    const recommendationsContainer = document.getElementById("search_recommendations");
    recommendationsContainer.style.display = "none";
    recommendationsContainer.innerHTML = "";
}
function debounce(func, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}
function search(){
    window.location.href="/search?q="+document.getElementById("search_bar").value;
}
