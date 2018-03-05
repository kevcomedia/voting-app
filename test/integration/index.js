const chai = require('chai');
const chaiHttp = require('chai-http');
const http = require('http');

const {expect} = chai;
chai.use(chaiHttp);

const app = require('../../app');
const server = http.createServer(app);

before(function startServer(done) {
  server.listen(3001, done);
});

after(function stopServer(done) {
  server.close(done);
});

module.exports = () => chai.request(server);
