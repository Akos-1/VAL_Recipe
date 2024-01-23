document.addEventListener('DOMContentLoaded', function () {
    // Show the popup and overlay when the page is loaded
    document.getElementById('popup').style.display = 'flex';
    document.getElementById('overlay').style.display = 'block';

    // Close the popup and overlay when the button is clicked
    document.getElementById('closePopup').addEventListener('click', function () {
        document.getElementById('popup').style.display = 'none';
        document.getElementById('overlay').style.display = 'none';
    });
});
