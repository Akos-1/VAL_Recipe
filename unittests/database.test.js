const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app'); // Adjust the path as needed
const expect = chai.expect;

chai.use(chaiHttp);

describe('GET /testdb', () => {
  it('should return status 200 and a success message', async () => {
    const res = await chai.request(app).get('/testdb');
    expect(res).to.have.status(200);
    expect(res.body).to.have.property('message').equal('Database connection successful');
  });
});
