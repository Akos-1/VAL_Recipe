const request = require('supertest');
const app = require('../server');
const assert = require('assert');

describe('GET /dashboard/:email', () => {
  it('should return the dashboard page', (done) => {
    const userEmail = 'test@example.com';
    request(app)
      .get(`/dashboard/${userEmail}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        // Add assertions for dashboard page content if needed
        done();
      });
  });
});
