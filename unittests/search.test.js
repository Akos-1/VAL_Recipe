const request = require('supertest');
const app = require('../server');
const assert = require('assert');

describe('GET /recipes/search', () => {
  it('should return recipes based on search query', (done) => {
    const searchQuery = 'chicken';
    request(app)
      .get(`/recipes/search?search=${searchQuery}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        assert(res.body.hasOwnProperty('recipes'));
        // Add more assertions for returned recipes if needed
        done();
      });
  });
});
