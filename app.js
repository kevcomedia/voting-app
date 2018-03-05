const express = require('express');
const api = require('./routes');

const app = express();

app.use('/', api);

app.get('/', (req, res) => {
  res.send('Hello world');
});

module.exports = app;
