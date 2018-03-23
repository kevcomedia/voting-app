const {expect} = require('chai');
const request = require('..');
const Poll = require('../../../models/poll.model');
const User = require('../../../models/user.model');

const endpoint = '/api/v1/polls/create';

describe('Poll creation', function() {
  let token;

  const createPollRequest = () =>
    request()
      .post(endpoint)
      .set('Authorization', `jwt ${token}`);

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

  afterEach(function removeCreatedPolls(done) {
    Poll.remove({}, done);
  });

  after(function removeCreatedUser(done) {
    User.remove({}, done);
  });

  describe('Polls with at least two choices', function() {
    const cases = [
      {
        label: 'creates a poll with two choices',
        body: {
          question: 'Example poll with two choices',
          choices: ['Choice 1', 'Choice 2'],
        },
      },
      {
        label: 'creates a poll with three choices',
        body: {
          question: 'Example poll with three choices',
          choices: ['Choice 1', 'Choice 2', 'Choice 3'],
        },
      },
    ];

    cases.forEach(({label, body}) => {
      it(label, function(done) {
        createPollRequest()
          .send(body)
          .then(res => {
            expect(res).to.have.status(201);
            expect(res).to.be.a.json;
            expect(res.body).to.have.property('success').that.is.true;
            expect(res.body)
              .to.have.property('message')
              .that.equals('Poll created');
            expect(res.body)
              .to.have.property('poll')
              .that.is.an('object');
            expect(res.body.poll)
              .to.have.property('question')
              .that.equals(body.question);
            expect(res.body.poll)
              .to.have.property('choices')
              .that.is.an('array')
              .with.lengthOf(body.choices.length);
            expect(res.body.poll)
              .to.have.property('meta')
              .that.is.an('object');
            expect(res.body.poll.meta)
              .to.have.property('owner')
              .that.is.an('object')
              .that.includes({username: 'sample-user'});
            // I'll handwave and just check for the existence of a date string.
            // Maybe there's a plugin for checking date strings?
            expect(res.body.poll.meta)
              .to.have.property('dateCreated')
              .that.is.a('string');
            done();
          })
          .catch(done);
      });
    });
  });

  describe('Polls with less than two choices', function() {
    const cases = [
      {
        label: "doesn't create a poll with just one choice",
        body: {
          question: 'Example poll with one choice',
          choices: ['Choice 1'],
        },
      },
      {
        label: "doesn't create a poll with no choices",
        body: {
          question: 'Example poll with no choices',
          choices: [],
        },
      },
    ];

    cases.forEach(({label, body}) => {
      it(label, function(done) {
        createPollRequest()
          .send(body)
          .catch(({response}) => {
            expect(response).to.have.status(422);
            expect(response).to.be.a.json;
            expect(response.body).to.have.property('success').that.is.false;
            expect(response.body)
              .to.have.property('message')
              .that.equals('There should be at least two choices');
            done();
          })
          .catch(done);
      });
    });
  });

  describe('Polls with blank questions', function() {
    const cases = ['', ' ', '  ', null];
    cases.forEach(c => {
      it(`doesn't create a poll if the question is ${JSON.stringify(
        c
      )}`, function(done) {
        createPollRequest()
          .send({
            question: c, // or null? or just whitespace?
            choices: ['Choice 1', 'Choice 2'],
          })
          .then(res => {
            expect(res).to.not.exist;
            done();
          })
          .catch(({response}) => {
            expect(response).to.have.status(422);
            expect(response).to.be.a.json;
            expect(response.body).to.have.property('success').that.is.false;
            expect(response.body)
              .to.have.property('message')
              .that.equals('There should be a question');
            done();
          })
          .catch(done);
      });
    });
  });

  it("doesn't create a poll with a blank choice", function(done) {
    createPollRequest()
      .send({
        question: 'Example poll with missing choice',
        choices: ['', 'Choice 2'],
      })
      .catch(({response}) => {
        expect(response).to.have.status(422);
        expect(response).to.be.a.json;
        expect(response.body).to.have.property('success').that.is.false;
        expect(response.body)
          .to.have.property('message')
          .that.equals('Choices cannot be blank');
        done();
      })
      .catch(done);
  });
});

describe('Poll creation (unauthenticated user)', function() {
  it('should not create a poll', function(done) {
    request()
      .post(endpoint)
      .send({
        question: 'Example poll that should not be created',
        choices: ['Choice 1', 'Choice 2'],
      })
      .catch(({response}) => {
        // We'll keep it simple for this one and just expect a 401. Writing a
        // custom callback for passport for the fancy stuff is more trouble than
        // it's worth.
        expect(response).to.have.status(401);
        done();
      })
      .catch(done);
  });
});
