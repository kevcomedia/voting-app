const express = require('express');
const authRouter = require('./auth.routes');

const router = express.Router();

router.use('/api/v1/', authRouter);

module.exports = router;
