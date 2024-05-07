const request = require('supertest');
const app = require('../app');
const assert = require('assert');

describe('DELETE /api/recipes/:id', () => {
  it('should delete an existing recipe', (done) => {
    const recipeId = '123'; // Replace with a valid recipe ID
    request(app)
      .delete(`/api/recipes/${recipeId}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        assert.strictEqual(res.body.message, 'Recipe deleted successfully');
        done();
      });
  });
});
