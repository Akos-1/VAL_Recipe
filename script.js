// script.js

function searchRecipes(event) {
    event.preventDefault(); // Prevent the form from submitting

    const searchQuery = document.querySelector('input[name="search"]').value;

    fetch(`http://localhost:5002/recipes?search=${searchQuery}`)
        .then(response => response.json())
        .then(data => {
            // Handle the data and update the UI (recipe-list)
            const recipeList = document.getElementById('recipe-list');
            recipeList.innerHTML = ''; // Clear existing content

            data.recipes.forEach(recipe => {
                const listItem = document.createElement('li');
                listItem.textContent = `${recipe.title} - ${recipe.ingredients}`;
                recipeList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error searching recipes:', error));
}
