const async = require('async');
const chai = require('chai');
const chaiHttp = require('chai-http');
const http = require('http');
const mongoose = require('mongoose');

const {expect} = chai;
chai.use(chaiHttp);

const app = require('../../app');
const server = http.createServer(app);

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/test-voting-app');

before(function startServer(done) {
  // Using async is probably overkill, but other alternatives are promisifying
  // both, then use Promise.all, or just nest the callbacks
  async.parallel(
    [
      callback => {
        mongoose.connection.once('connected', callback);
      },
      callback => {
        server.listen(3001, callback);
      },
    ],
    done
  );
});

after(function stopServer(done) {
  async.parallel(
    [
      callback => {
        mongoose.connection.close(callback);
      },
      callback => {
        server.close(callback);
      },
    ],
    done
  );
});

module.exports = () => chai.request(server);
