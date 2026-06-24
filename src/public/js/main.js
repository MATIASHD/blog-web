document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed');
});

const dropdownElement = document.getElementById('dropdownMenuButton');
const dropdown = new bootstrap.Dropdown(dropdownElement);
