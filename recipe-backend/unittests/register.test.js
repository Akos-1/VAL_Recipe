const request = require('supertest');
const app = require('../app');
const assert = require('assert');

describe('POST /auth/register', () => {
  it('should register a new user', (done) => {
    const userData = { email: 'test@example.com', password: 'testpassword' };
    request(app)
      .post('/auth/register')
      .send(userData)
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        assert.strictEqual(res.body.message, 'Registration successful!');
        assert(res.body.hasOwnProperty('dashboardUrl'));
        done();
      });
  });
});
