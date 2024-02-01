document.addEventListener('DOMContentLoaded', function () {
    const loginLink = document.getElementById('loginLink');
    const loginSlidePanel = document.getElementById('loginSlidePanel');

    loginLink.addEventListener('click', function (event) {
        event.preventDefault();
        toggleLoginForm();
    });

    function toggleLoginForm() {
        loginSlidePanel.classList.toggle('slide-in');
    }
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
    // Update recipe list HTML here
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
        // To Handle the response, success message or redirect
        console.log(data);
        alert('Login successful!'); 
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Wrong email or password!'); 
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
        //response, success message or redirect
        console.log(data);
        alert('Registration successful!'); 
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Registration failed!'); 
    });
}

