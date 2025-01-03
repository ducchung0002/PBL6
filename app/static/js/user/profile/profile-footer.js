function openPage(pageName, elmnt, color, text_color) {
    // Hide all elements with class="tabcontent" by default */
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Remove the background color of all tablinks/buttons
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].style.backgroundColor = "";
        changeSpanColor(tablinks[i], 'black');
    }

    // Show the specific tab content
    document.getElementById(pageName).style.display = "block";

    // Add the specific color to the button used to open the tab content
    elmnt.style.backgroundColor = color;
    changeSpanColor(elmnt, text_color);
}
function changeSpanColor(button, color) {
    const span = button.querySelector('.tabLinkText');
    if (span) {
        span.style.color = color;
    }
}
document.getElementById("defaultOpen").click();