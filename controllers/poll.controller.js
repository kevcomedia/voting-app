const {check, validationResult} = require('express-validator/check');
const {matchedData} = require('express-validator/filter');
const Poll = require('../models/poll.model');

const create = [
  [
    check('question')
      .trim()
      .not()
      .isEmpty()
      .withMessage('There should be a question'),
    check('choices')
      .custom(Array.isArray)
      .withMessage('There should be at least two choices'),
    check('choices')
      .custom(choices => choices.length >= 2)
      .withMessage('There should be at least two choices'),
    check('choices.*')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Choices cannot be blank'),
  ],
  function create(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = new Error(errors.array()[0].msg);
      err.status = 422;
      return next(err);
    }

    const {question, choices} = matchedData(req);

    Poll.create({
      question,
      choices,
      meta: {owner: req.user.id},
    })
      .then(poll =>
        Poll.populate(poll, {path: 'meta.owner', select: 'username'})
      )
      .then(poll => {
        res.status(201).json({
          success: true,
          message: 'Poll created',
          poll,
        });
      })
      .catch(next);
  },
];

module.exports = {
  create,
};
