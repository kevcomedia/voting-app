const sinon = require('sinon');
const {expect} = require('chai');
const User = require('../../models/user.model');

describe('User model', function() {
  describe('User.createUser', function() {
    it('creates a new User document', function(done) {
      const dummyUserInfo = {username: 'dummy', password: 'sample-password'};
      const expectedValue = {
        username: 'dummy',
        password: 'hashed-password-123',
      };

      sinon.stub(User, 'findOne').resolves(null);
      const createStub = sinon.stub(User, 'create').resolves(expectedValue);

      User.createUser(dummyUserInfo)
        .then(result => {
          sinon.assert.calledWith(createStub, dummyUserInfo);
          expect(result).to.equal(expectedValue);

          User.findOne.restore();
          User.create.restore();
          done();
        })
        .catch(done);
    });

    it('throws an error when the username is already used', function(done) {
      const dummyUserInfo = {username: 'dummy', password: 'sample-password'};
      const fakeStoredUserInfo = {
        username: 'dummy',
        password: 'hashed-password-123',
      };

      const stub = sinon.stub(User, 'findOne').resolves(fakeStoredUserInfo);

      User.createUser(dummyUserInfo)
        .catch(err => {
          sinon.assert.calledWith(stub, {username: 'dummy'});
          expect(err)
            .to.be.an('error')
            .that.has.property('name')
            .that.equals('UsernameTakenError');

          User.findOne.restore();
          done();
        })
        .catch(done); // for actual errors in testing
    });

    describe('Short passwords', function() {
      const minPasswordLength = 10;
      // We'll ignore good password lengths. A more rigorous check would be
      // better though.
      const passwordLengths = [5, 9, 10, 11, 15];
      passwordLengths.forEach(length => {
        if (length >= minPasswordLength) return;

        it(`doesn't accept a password of length ${length}`, function(done) {
          const dummyUserInfo = {
            username: 'dummy',
            // We only care for the length of the string, not its contents
            password: Array.from({length}, () => 'a').join(''),
          };

          const stub = sinon.stub(User, 'findOne').resolves(null);

          User.createUser(dummyUserInfo)
            .catch(err => {
              expect(err)
                .to.be.an('error')
                .that.has.property('name')
                .that.equals('InvalidPasswordLengthError');

              User.findOne.restore();
              done();
            })
            .catch(done);
        });
      });
    });
  });
});
