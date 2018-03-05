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
});
