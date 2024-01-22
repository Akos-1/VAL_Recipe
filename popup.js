// script.js

document.addEventListener('DOMContentLoaded', openPopup);

function openPopup() {
    document.getElementById('popupContainer').style.display = 'flex';
}

function closePopup() {
    document.getElementById('popupContainer').style.display = 'none';
}