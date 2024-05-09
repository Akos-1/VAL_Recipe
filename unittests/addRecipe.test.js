const request = require('supertest');
const app = require('../server');
const assert = require('assert');

describe('POST /recipes/add', () => {
  it('should add a new recipe', (done) => {
    const recipeData = { title: 'Test Recipe', ingredients: 'Ingredient 1, Ingredient 2', instructions: 'Step 1, Step 2' };
    request(app)
      .post('/recipes/add')
      .send(recipeData)
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        assert.strictEqual(res.body.message, 'Recipe added successfully');
        done();
      });
  });
});
