const Poll = require('../models/poll.model');

function create(req, res, next) {
  const {question, choices} = req.body;

  if (!question) {
    const err = new Error('There should be a question');
    err.status = 422;
    return next(err);
  }

  if (!choices || choices.length < 2) {
    const err = new Error('There should be at least two choices');
    err.status = 422;
    return next(err);
  }

  if (choices.some(choice => !choice)) {
    const err = new Error('Choices cannot be blank');
    err.status = 422;
    return next(err);
  }

  Poll.create({
    question,
    choices: choices.map(choice => ({
      label: choice,
    })),
    meta: {
      owner: req.user.username,
    },
  })
    .then(poll => {
      res.status(201).json({
        success: true,
        message: 'Poll created',
        poll: {
          question: poll.question,
          choices: poll.choices.map(choice => choice.label),
          meta: poll.meta,
        },
      });
    })
    .catch(next);
}

module.exports = {
  create,
};
