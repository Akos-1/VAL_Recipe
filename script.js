// script.js

function searchRecipes(event) {
    event.preventDefault(); // Prevent the form from submitting

    const searchQuery = document.querySelector('input[name="search"]').value.toLowerCase();

    fetch(`http://localhost:5002/recipes`)
        .then(response => response.json())
        .then(data => {
            // Handle the data and update the UI (recipe-list)
            const recipeList = document.getElementById('recipe-list');
            recipeList.innerHTML = ''; // Clear existing content

            const filteredRecipes = data.recipes.filter(recipe => {
            return (
                recipe.title.toLowerCase().includes(searchQuery) ||
                recipe.ingredients.toLowerCase().includes(searchQuery) ||
                searchQuery === 'waakye'  // Check for the exact match of "Waakye"
            );
        });

        if (filteredRecipes.length === 0) {
            const noResultsItem = document.createElement('li');
            noResultsItem.textContent = 'No recipes found.';
            recipeList.appendChild(noResultsItem);
        } else {
            filteredRecipes.forEach(recipe => {
                const listItem = document.createElement('li');
                listItem.textContent = `${recipe.title} - ${recipe.ingredients}`;
                recipeList.appendChild(listItem);
            });
        }
    })
    .catch(error => console.error('Error searching recipes:', error));
}
