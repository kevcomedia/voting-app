const express = require('express');
const passport = require('passport');
const api = require('./routes');

const app = express();

app.use(passport.initialize());
require('./config/passport');

app.use('/', api);

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

module.exports = app;
