const express = require('express');
const pollController = require('../controllers/poll.controller');

// eslint-disable-next-line new-cap
const pollRouter = express.Router();

pollRouter.post('/create', pollController.create);

module.exports = pollRouter;
