const request = require('supertest');
const app = require('../server');
const assert = require('assert');

describe('PUT /api/recipes/:id', () => {
  it('should update an existing recipe', (done) => {
    const recipeId = '123'; // Replace with a valid recipe ID
    const updatedRecipeData = { title: 'Updated Test Recipe', ingredients: 'Updated Ingredient 1, Updated Ingredient 2', instructions: 'Updated Step 1, Updated Step 2' };
    request(app)
      .put(`/api/recipes/${recipeId}`)
      .send(updatedRecipeData)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        assert.strictEqual(res.body.message, 'Recipe updated successfully');
        done();
      });
  });
});
