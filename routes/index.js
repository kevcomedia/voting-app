const express = require('express');
const authRouter = require('./auth.routes');
//
// eslint-disable-next-line new-cap
const router = express.Router();

router.use('/api/v1/', authRouter);

module.exports = router;
