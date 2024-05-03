// Function to toggle the login popup
function togglePopup(popupId) {
    const popup = document.getElementById(popupId);
    const overlay = document.getElementById('overlay');
    if (popup.style.display === 'block') {
        popup.style.display = 'none';
        overlay.style.display = 'none';
    } else {
        popup.style.display = 'block';
        overlay.style.display = 'block';
    }
}

// Function to register a new user
async function registerUser(event) {
    event.preventDefault();
    const username = document.querySelector('#register-username').value;
    const password = document.querySelector('#register-password').value;
    try {
        const response = await fetch('/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        if (!response.ok) {
            throw new Error('Failed to register user');
        }
        alert('Registration successful!');
        // Optionally, redirect to login page after successful registration
    } catch (error) {
        console.error(error);
    }
}

// Function to log in an existing user
async function loginUser(event) {
    event.preventDefault();
    const username = document.querySelector('#login-username').value;
    const password = document.querySelector('#login-password').value;
    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        if (!response.ok) {
            throw new Error('Failed to log in user');
        }
        alert('Login successful!');
        // Optionally, redirect to dashboard after successful login
    } catch (error) {
        console.error(error);
    }
}

// Function to fetch recipes based on search query
async function searchRecipes(event) {
    event.preventDefault();
    const searchQuery = document.querySelector('input[name="search"]').value;
    try {
        const response = await fetch(`/recipes/search?search=${searchQuery}`);
        if (!response.ok) {
            throw new Error('Failed to fetch recipes');
        }
        const data = await response.json();
        displayRecipes(data.recipes);
    } catch (error) {
        console.error(error);
    }
}

// Function to display recipes on the page
function displayRecipes(recipes) {
    const recipeList = document.getElementById('recipe-list');
    recipeList.innerHTML = ''; // Clear previous content
    recipes.forEach(recipe => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <h3>${recipe.title}</h3>
            <p><strong>Ingredients:</strong> ${recipe.ingredients}</p>
            <p><strong>Instructions:</strong> ${recipe.instructions}</p>
            <button onclick="editRecipe(${recipe.id})">Edit</button>
            <button onclick="deleteRecipe(${recipe.id})">Delete</button>
        `;
        recipeList.appendChild(listItem);
    });
}

// Function to handle adding a new recipe
async function addRecipe(event) {
    event.preventDefault();
    const title = document.querySelector('#add-title').value;
    const ingredients = document.querySelector('#add-ingredients').value;
    const instructions = document.querySelector('#add-instructions').value;
    try {
        const response = await fetch('/recipes/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, ingredients, instructions })
        });
        if (!response.ok) {
            throw new Error('Failed to add recipe');
        }
        alert('Recipe added successfully!');
        searchRecipes(event); // Refresh recipe list
    } catch (error) {
        console.error(error);
    }
}

// Function to handle updating a recipe
async function editRecipe(id) {
    const newTitle = prompt('Enter new title for the recipe:');
    if (newTitle === null) return; // User canceled
    const newIngredients = prompt('Enter new ingredients for the recipe:');
    if (newIngredients === null) return; // User canceled
    const newInstructions = prompt('Enter new instructions for the recipe:');
    if (newInstructions === null) return; // User canceled
    try {
        const response = await fetch(`/recipes/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title: newTitle, ingredients: newIngredients, instructions: newInstructions })
        });
        if (!response.ok) {
            throw new Error('Failed to update recipe');
        }
        alert('Recipe updated successfully!');
        searchRecipes(event); // Refresh recipe list
    } catch (error) {
        console.error(error);
    }
}

// Function to handle deleting a recipe
async function deleteRecipe(id) {
    const confirmation = confirm('Are you sure you want to delete this recipe?');
    if (!confirmation) return;
    try {
        const response = await fetch(`/recipes/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Failed to delete recipe');
        }
        alert('Recipe deleted successfully!');
        searchRecipes(event); // Refresh recipe list
    } catch (error) {
        console.error(error);
    }
}

// Function to handle uploading a recipe video or adding a recipe URL
async function uploadRecipeVideo(id, file) {
    const formData = new FormData();
    formData.append('recipeVideo', file);
    try {
        const response = await fetch(`/recipes/${id}/upload`, {
            method: 'POST',
            body: formData
        });
        if (!response.ok) {
            throw new Error('Failed to upload recipe video');
        }
        alert('Recipe video uploaded successfully!');
    } catch (error) {
        console.error(error);
    }
}
