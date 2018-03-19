const {expect} = require('chai');
const request = require('..');
const User = require('../../../models/user.model');

describe('User registration', function() {
  const registerEndpoint = '/api/v1/register';

  const dropUsers = done => {
    User.remove({}, done);
  };

  before(dropUsers);
  afterEach(dropUsers);

  it('registers successfully', function(done) {
    request()
      .post(registerEndpoint)
      .send({username: 'newuser', password: 'new-password'})
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res).to.be.a.json;
        expect(res.body)
          .to.have.property('success')
          .that.equals(true);
        expect(res.body)
          .to.have.property('username')
          .that.equals('newuser');
        expect(res.body)
          .to.have.property('token')
          .that.matches(/^[0-9A-Za-z\-_]+\.[0-9A-Za-z\-_]+\.[0-9A-Za-z\-_]+/);
        done();
      });
  });

  it("doesn't register duplicate usernames", function(done) {
    request()
      .post(registerEndpoint)
      .send({username: 'newuser', password: 'new-password'})
      .then(() =>
        request()
          .post(registerEndpoint)
          .send({username: 'newuser', password: 'new-password'})
      )
      .catch(({response}) => {
        expect(response).to.have.status(422);
        expect(response).to.be.a.json;
        expect(response.body)
          .to.have.property('success')
          .that.equals(false);
        expect(response.body)
          .to.have.property('message')
          .that.equals('Username is already taken');
        done();
      })
      .catch(done);
  });

  it("doesn't register if password is too short", function(done) {
    request()
      .post(registerEndpoint)
      .send({username: 'newUser', password: '123456789'})
      .end(({response}) => {
        expect(response).to.have.status(422);
        expect(response).to.be.a.json;
        expect(response.body)
          .to.have.property('success')
          .that.equals(false);
        expect(response.body)
          .to.have.property('message')
          .that.equals('Password should be at least 10 characters long');
        done();
      });
  });

  it("doesn't register if the username is blank", function(done) {
    request()
      .post(registerEndpoint)
      .send({username: '', password: 'new-password'})
      .end(({response}) => {
        expect(response).to.have.status(422);
        expect(response).to.be.a.json;
        expect(response.body)
          .to.have.property('success')
          .that.equals(false);
        expect(response.body)
          .to.have.property('message')
          .that.equals('Username cannot be blank');
        done();
      });
  });
});
