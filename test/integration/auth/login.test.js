const {expect} = require('chai');
const request = require('..');
const User = require('../../../models/user.model');

describe('User login', function() {
  const loginEndpoint = '/api/v1/login';
  const userInfo = {username: 'kev', password: 'sample-password'};

  before(function register(done) {
    request()
      .post('/api/v1/register')
      .send(userInfo)
      .end(done);
  });

  after(function dropUsers(done) {
    User.remove({}, done);
  });

  it('logins a user', function(done) {
    request()
      .post(loginEndpoint)
      .send(userInfo)
      .then(res => {
        expect(res).to.have.status(200);
        expect(res).to.be.a.json;
        expect(res.body)
          .to.have.property('success')
          .that.equals(true);
        expect(res.body)
          .to.have.property('token')
          .that.matches(/^[0-9A-Za-z\-_]+\.[0-9A-Za-z\-_]+\.[0-9A-Za-z\-_]+/);
        done();
      })
      .catch(done);
  });

  it("doesn't login if the username is incorrect", function(done) {
    request()
      .post(loginEndpoint)
      .send({username: 'not-kev', password: 'sample-password'})
      .catch(({response}) => {
        expect(response).to.have.status(422);
        expect(response).to.be.a.json;
        expect(response)
          .to.have.property('success')
          .that.equals(false);
        expect(response)
          .to.have.property('message')
          .that.equals('Incorrect username/password');
        done();
      })
      .catch(done);
  });

  it("doesn't login if the password is incorrect", function(done) {
    request()
      .post(loginEndpoint)
      .send({username: 'kev', password: 'incorrect-password'})
      .catch(({response}) => {
        expect(response).to.have.status(422);
        expect(response).to.be.a.json;
        expect(response)
          .to.have.property('success')
          .that.equals(false);
        expect(response)
          .to.have.property('message')
          .that.equals('Incorrect username/password');
        done();
      })
      .catch(done);
  });
});
