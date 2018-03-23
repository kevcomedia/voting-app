const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const authRouter = require('./auth.routes');
const pollRouter = require('./poll.routes');

// eslint-disable-next-line new-cap
const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

router.use('/api/v1/', authRouter);
router.use(
  '/api/v1/polls/',
  passport.authenticate('jwt', {session: false}),
  pollRouter
);

module.exports = router;
