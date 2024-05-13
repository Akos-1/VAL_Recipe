function togglePopup(popupId) {
    const popup = document.getElementById(popupId);
    const overlay = document.getElementById('overlay-login');
    if (popup.classList.contains('active')) {
        popup.classList.remove('active');
        overlay.style.display = 'none';
    } else {
        popup.classList.add('active');
        overlay.style.display = 'block';
    }
}

// Function to toggle the registration form
function toggleRegisterForm() {
    const registerForm = document.getElementById('register-form');
    if (registerForm.style.display === 'block') {
        registerForm.style.display = 'none';
    } else {
        registerForm.style.display = 'block';
    }
}

// Function to handle user registration
async function registerUser(event) {
    event.preventDefault(); // Prevent the default form submission

    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;

    // Validate password and confirm password
    if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }

    // Create an object with the user data
    const userData = {
        name: name,
        email: email,
        password: password
    };

    try {
        // Send a POST request to register the user
        const response = await fetch('/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            // Registration successful
            alert('Registration successful');
            window.location.href = "login.html";
        } else {
            // Registration failed
            throw new Error('Registration failed');
        }
    } catch (error) {
        console.error(error);
        alert('Registration failed');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Add event listener to the "Register here" link
    document.getElementById('register-link').addEventListener('click', function(event) {
        event.preventDefault();
        toggleRegisterForm(); 
    });

    // Add event listener to the search form for submission
    const searchForm = document.getElementById('search-form');
    if (searchForm) { // Check if search form exists
        searchForm.addEventListener('submit', function(event) {
            searchRecipes(event); // Pass event to searchRecipes function
        });
    }
});


async function loginUser(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        if (!response.ok) {
            throw new Error('Login failed');
        }
        const responseData = await response.json();
        if (responseData.dashboardUrl) {
            // Redirect to user's dashboard
            window.location.href = responseData.dashboardUrl;
        } else {
            alert('Dashboard URL not found');
        }
    } catch (error) {
        console.error(error);
    }
}


// Function to handle searching for recipes
async function searchRecipes() {
    const searchInput = document.getElementById('search');
    const searchQuery = searchInput.value.trim().toLowerCase();

    try {
        // Fetch all recipes
        const response = await fetch(`/recipes/all`);
        if (!response.ok) {
            throw new Error('Failed to fetch recipes');
        }
        const recipes = await response.json();

        // Filter recipes based on search query
        const filteredRecipes = recipes.filter(recipe => {
            // Check if recipe title or ingredients contain the search query
            return recipe.title.toLowerCase().includes(searchQuery) || recipe.ingredients.toLowerCase().includes(searchQuery);
        });

        // Display filtered recipes
        displayRecipes(filteredRecipes);
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
