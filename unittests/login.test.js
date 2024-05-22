const request = require('supertest');
const app = require('../server');
const assert = require('assert');

describe('POST /auth/login', () => {
  it('should log in an existing user', (done) => {
    const userData = { email: 'testemail@example.com', password: 'testpassword' };
    request(app)
      .post('/auth/login')
      .send(userData)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        assert.strictEqual(res.body.message, 'Login successful!');
        assert(res.body.hasOwnProperty('dashboardUrl'));
        done();
      });
  });

  it('should return 401 for invalid credentials', (done) => {
    const userData = { email: 'nonexistent@example.com', password: 'invalidpassword' };
    request(app)
      .post('/auth/login')
      .send(userData)
      .expect(401)
      .end((err, res) => {
        if (err) return done(err);
        assert.strictEqual(res.body.message, 'Invalid email or password');
        done();
      });
  });
});
