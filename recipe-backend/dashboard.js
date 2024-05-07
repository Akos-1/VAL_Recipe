function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

app.get('/dashboard', isAuthenticated, (req, res) => {
    res.render('dashboard', { user: req.user });
});

// Other routes that require authentication will be added...




// Function to fetch user-specific data and populate the dashboard
async function populateDashboard() {
    try {
        // Fetch user profile information
        const profileResponse = await fetch('/api/profile');
        const profileData = await profileResponse.json();
        // Populate profile section
        const profileInfo = document.getElementById('profile-info');
        profileInfo.innerHTML = `
            <p>Name: ${profileData.name}</p>
            <p>Email: ${profileData.email}</p>
            <!-- Add more profile information as needed -->
        `;

        // Fetch recent activity
        const activityResponse = await fetch('/api/activity');
        const activityData = await activityResponse.json();
        // Populate activity section
        const activitySummary = document.getElementById('activity-summary');
        activitySummary.innerHTML = `
            <ul>
                ${activityData.map(activity => `<li>${activity.description}</li>`).join('')}
            </ul>
        `;

        // Fetch user's recipes
        const recipesResponse = await fetch('/api/recipes');
        const recipesData = await recipesResponse.json();
        // Populate recipes section
        const recipeList = document.getElementById('recipe-list');
        recipeList.innerHTML = '';
        recipesData.forEach(recipe => {
            const listItem = document.createElement('div');
            listItem.innerHTML = `
                <h3>${recipe.title}</h3>
                <p>${recipe.instructions}</p>
                <!-- Add more recipe details as needed -->
                <button onclick="editRecipe(${recipe.id})">Edit</button>
                <button onclick="deleteRecipe(${recipe.id})">Delete</button>
            `;
            recipeList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error fetching and populating dashboard:', error);
    }
}

// Function to handle adding a recipe
async function addRecipe(event) {
    event.preventDefault();
    const title = document.getElementById('recipe-title').value;
    const instructions = document.getElementById('recipe-instructions').value;
    const imageFile = document.getElementById('recipe-image').files[0];
    const videoFile = document.getElementById('recipe-video').files[0];
    try {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('instructions', instructions);
        formData.append('image', imageFile);
        formData.append('video', videoFile);
        const response = await fetch('/api/recipes', {
            method: 'POST',
            body: formData
        });
        if (!response.ok) {
            throw new Error('Failed to add recipe');
        }
        alert('Recipe added successfully!');
        populateDashboard(); // Refresh dashboard with updated recipe list
    } catch (error) {
        console.error('Error adding recipe:', error);
    }
}

// Function to handle editing a recipe
async function editRecipe(id) {
    const newTitle = prompt('Enter new title for the recipe:');
    if (newTitle === null) return; // User canceled
    const newIngredients = prompt('Enter new ingredients for the recipe:');
    if (newIngredients === null) return; // User canceled
    const newInstructions = prompt('Enter new instructions for the recipe:');
    if (newInstructions === null) return; // User canceled
    try {
        const response = await fetch(`/api/recipes/${id}`, {
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
        populateDashboard(); // Refresh dashboard with updated recipe list
    } catch (error) {
        console.error(error);
    }
}

// Function to handle deleting a recipe
async function deleteRecipe(recipeId) {
    const confirmation = confirm('Are you sure you want to delete this recipe?');
    if (!confirmation) return;
    try {
        const response = await fetch(`/api/recipes/${recipeId}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Failed to delete recipe');
        }
        alert('Recipe deleted successfully!');
        populateDashboard(); // Refresh dashboard with updated recipe list
    } catch (error) {
        console.error(error);
    }
}

// Populate the dashboard when the page loads
document.addEventListener('DOMContentLoaded', populateDashboard);
