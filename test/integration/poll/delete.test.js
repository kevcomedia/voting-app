const {expect} = require('chai');
const request = require('..');
const Poll = require('../../../models/poll.model');
const User = require('../../../models/user.model');

describe('Poll deletion', function() {
  let token;
  let poll;

  before(function createToken(done) {
    // Probably a more sophisticated approach is to stub the parts that
    // accept/generate a token
    request()
      .post('/api/v1/register')
      .send({
        username: 'sample-user',
        password: 'sample-password',
      })
      .then(res => {
        token = res.body.token;
        done();
      })
      .catch(done);
  });

  beforeEach(function createPoll(done) {
    request()
      .post('/api/v1/polls/create')
      .set('Authorization', `jwt ${token}`)
      .send({
        question: 'Example poll with two choices',
        choices: ['Choice 1', 'Choice 2'],
      })
      .then(res => {
        poll = res.body.poll;
        done();
      })
      .catch(done);
  });

  afterEach(function removeCreatedPolls(done) {
    poll = null;
    Poll.remove({}, done);
  });

  after(function removeCreatedUser(done) {
    User.remove({}, done);
  });

  it('deletes the poll with the given id', function(done) {
    request()
      .delete(`/api/v1/polls/${poll._id}`)
      .set('Authorization', `jwt ${token}`)
      .then(res => {
        expect(res).to.have.status(200);
        expect(res).to.be.a.json;
        expect(res.body).to.have.property('success').that.is.true;
        expect(res.body)
          .to.have.property('message')
          .that.equals(`Poll '${poll._id}' has been deleted`);
        done();
      })
      .catch(done);
  });

  it("doesn't delete if no poll with the given id is found", function(done) {
    request()
      .delete('/api/v1/polls/fake-id-123')
      .set('Authorization', `jwt ${token}`)
      .then(res => {
        expect(res).to.not.exist;
        done();
      })
      .catch(({response}) => {
        expect(response).to.have.status(404);
        expect(response).to.be.a.json;
        expect(response.body).to.have.property('success').that.is.false;
        expect(response.body)
          .to.have.property('message')
          .that.equals("Poll 'fake-id-123' not found");
        done();
      })
      .catch(done);
  });
});

describe('Poll deletion (unauthenticated user)', function() {
  it('should not delete a poll', function(done) {
    request()
      .delete('/api/v1/polls/some-id-123')
      .catch(({response}) => {
        expect(response).to.have.status(401);
        done();
      })
      .catch(done);
  });
});
