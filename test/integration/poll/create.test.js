const {expect} = require('chai');
const request = require('..');
const Poll = require('../../../models/poll.model');

describe('Poll creation', function() {
  const endpoint = '/api/v1/polls/create';

  describe('Polls with at least two choices', function() {
    it('creates a poll with two choices');
    it('creates a poll with three choices');
  });

  describe('Polls with less than two choices', function() {
    it("doesn't create a poll with just one choice");
    it("doesn't create a poll with no choices");
  });

  it("doesn't create a poll with no question");
  it("doesn't create a poll with a blank choice");
});

describe('Poll creation (unauthenticated user)', function() {
  it('should not create a poll');
});
