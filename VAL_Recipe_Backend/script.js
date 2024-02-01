// script.js

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

