const express = require('express');
const pollController = require('../controllers/poll.controller');

// eslint-disable-next-line new-cap
const pollRouter = express.Router();

pollRouter.delete('/:_id', pollController.delete);
pollRouter.post('/create', pollController.create);

module.exports = pollRouter;
