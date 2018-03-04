const chai = require('chai');
const chaiHttp = require('chai-http');
const http = require('http');

const {expect} = chai;
chai.use(chaiHttp);

const app = require('../app');
let server = http.createServer(app);

before(function startServer(done) {
  server.listen(3001, done);
});

after(function stopServer(done) {
  server.close(done);
});

describe('Sample test', function() {
  it('greets with "Hello world"', function(done) {
    chai
      .request(server)
      .get('/')
      .then(res => {
        expect(res).to.have.status(200);
        expect(res).to.be.html;
        expect(res.text).to.equal('Hello world');
        done();
      });
  });
});
