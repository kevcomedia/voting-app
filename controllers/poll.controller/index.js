const create = require('./poll-create');
const deletePoll = require('./poll-delete');

module.exports = {
  create,
  delete: deletePoll,
};
