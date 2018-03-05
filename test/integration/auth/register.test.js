const async = require('async');
const {expect} = require('chai');
const request = require('..');

describe('User registration', function() {
  describe('Successful registration', function() {
    let response;

    before(function(done) {
      request()
        .post('/api/v1/register')
        .send({username: 'newuser', password: 'new-password'})
        .end((err, res) => {
          response = res;
          done();
        });
    });

    it('has status code 201', function() {
      expect(response).to.have.status(201);
    });

    it('should be a JSON', function() {
      expect(response).to.be.a.json;
    });

    it('contains a `success` property set to `true`', function() {
      expect(response.body)
        .to.have.property('success')
        .that.equals(true);
    });

    it('contains the username', function() {
      expect(response.body)
        .to.have.property('username')
        .that.equals('newuser');
    });

    it('contains the JWT', function() {
      expect(response.body)
        .to.have.property('token')
        .that.matches(/^[0-9A-Za-z\-_]+\.[0-9A-Za-z\-_]+\.[0-9A-Za-z\-_]+/);
    });
  });

  describe('Duplicate username', function() {
    let error;

    before(function(done) {
      async.series(
        [
          callback => {
            request()
              .post('/api/v1/register')
              .send({username: 'newuser', password: 'new-password'})
              .end(callback);
          },
          callback => {
            request()
              .post('/api/v1/register')
              .send({username: 'newuser', password: 'new-password'})
              .end((err, res) => {
                error = err;
              });
          },
        ],
        done
      );
    });

    it('has status code 422', function() {
      expect(error).to.have.status(422);
    });

    it('should be a JSON', function() {
      expect(error).to.be.a.json;
    });

    it('contains a `success` property set to `false`', function() {
      expect(error.body)
        .to.have.property('success')
        .that.equals('false');
    });

    it('contains a "Username taken" message', function() {
      expect(error.body)
        .to.have.property('message')
        .that.equals('Username is already taken');
    });
  });
});
