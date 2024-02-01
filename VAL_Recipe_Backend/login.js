document.addEventListener('DOMContentLoaded', function () {
    const loginLink = document.getElementById('loginLink');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    loginLink.addEventListener('click', function (event) {
        event.preventDefault();
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    });
});

function login() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        // Handle the response, e.g., show a success message or redirect
        console.log(data);
        alert('Login successful!'); // You can replace this with your own logic
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Login failed!'); // You can replace this with your own error handling
    });
}

function register() {
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        // Handle the response, e.g., show a success message or redirect
        console.log(data);
        alert('Registration successful!'); // You can replace this with your own logic
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Registration failed!'); // You can replace this with your own error handling
    });
}

