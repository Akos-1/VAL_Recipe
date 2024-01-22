// script.js
document.addEventListener('DOMContentLoaded', function () {
    // Show the popup when the page is loaded
    document.getElementById('popup').style.display = 'flex';

    // Close the popup when the button is clicked
    document.getElementById('closePopup').addEventListener('click', function () {
        document.getElementById('popup').style.display = 'none';
    });
});
