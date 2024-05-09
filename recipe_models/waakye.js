/**
 * @typedef {Object} Recipe
 * @property {number} id - The unique identifier for the recipe.
 * @property {string} title - The title of the recipe.
 * @property {string} ingredients - The list of ingredients for the recipe.
 * @property {string} instructions - The cooking instructions for the recipe.
 * @property {string} [videoUrl] - Optional field for the URL of a video associated with the recipe.
 */

/**
 * Represents a recipe.
 * @type {Recipe}
 */
const recipe = {
  id: 1,
  title: 'Waakye',
  ingredients: 'Rice, beans, sorghum leaves, salt',
  instructions: 'Wash beans and boil, add rice when the beans becomes a bit soft, add sorghum leaves and water, add salt, boil to cook, serve hot.',
  // Optionally, you can include a videoUrl field
  videoUrl: 'https://www.youtube.com/watch?v=pIuAG2eUlTM',
};

// Example usage:
console.log(recipe.title); // Output: Waakye
console.log(recipe.ingredients); // Output: Rice, beans, sorghum leaves, salt
