const {check, validationResult} = require('express-validator/check');
const {matchedData} = require('express-validator/filter');
const Poll = require('../../models/poll.model');

module.exports = [
  [
    check('_id', id => `Poll '${id}' not found`)
      .isMongoId()
      .custom(id =>
        Poll.findById(id).then(poll => {
          if (!poll) {
            Promise.reject(false);
          }
        })
      ),
  ],
  function deletePoll(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = new Error(errors.array()[0].msg);
      err.status = 404;
      return next(err);
    }

    const {_id} = matchedData(req);

    Poll.remove({_id})
      .then(result => {
        res.json({
          success: true,
          message: `Poll '${_id}' has been deleted`,
        });
      })
      .catch(next);
  },
];
