// script.js

document.addEventListener('DOMContentLoaded', function () {
    const loginLink = document.getElementById('loginLink');
    const loginRegisterPopup = document.getElementById('loginRegisterPopup');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    loginLink.addEventListener('click', function (event) {
        event.preventDefault();
        toggleLoginForm();
    });

    function toggleLoginForm() {
        loginRegisterPopup.style.display = (loginRegisterPopup.style.display === 'none' || loginRegisterPopup.style.display === '') ? 'block' : 'none';
        showLoginForm(); // Display the login form by default
    }

    function showLoginForm() {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    }

    window.showRegisterForm = function () {
        registerForm.style.display = 'block';
        loginForm.style.display = 'none';
    }

    window.showLoginForm = showLoginForm;
});

async function searchRecipes(event) {
    event.preventDefault();

    const searchTerm = document.querySelector('input[name="search"]').value;

    try {
        const response = await fetch('http://165.232.135.2:5002/api/search-recipes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ searchTerm }),
        });

        const data = await response.json();

        // Update the recipe list with the search results
        updateRecipeList(data);
    } catch (error) {
        console.error('Error searching recipes:', error);
    }
}

function updateRecipeList(recipes) {
    // Update your recipe list HTML here
    const recipeList = document.getElementById('recipe-list');
    recipeList.innerHTML = '';

    recipes.forEach((recipe) => {
        const listItem = document.createElement('li');
        listItem.textContent = recipe.name;
        recipeList.appendChild(listItem);
    });
}

function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
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
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
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

