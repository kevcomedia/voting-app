const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

function register(req, res, next) {
  const {username, password} = req.body;
  Promise.all([User.createUser({username, password}), signJwt({username})])
    .then(([createdUser, token]) => {
      res.status(201).json({
        success: true,
        message: 'User has been created',
        username,
        token,
      });
    })
    .catch(err => {
      err.status = 422;
      next(err);
    });
}

function login(req, res, next) {
  const {username, password} = req.body;
  Promise.all([User.authenticate({username, password}), signJwt({username})])
    .then(([authenticatedUser, token]) => {
      res.status(200).json({
        success: true,
        message: 'User is logged in',
        username,
        token,
      });
    })
    .catch(err => {
      err.status = 422;
      next(err);
    });
}

// Probably move this to some util directory. That way this can be tested.
function signJwt(payload = {}) {
  return new Promise(function(resolve, reject) {
    jwt.sign(
      payload,
      process.env.JWT_SECRET_KEY || 'use a proper key',
      (err, token) => {
        if (err) return reject(err);
        resolve(token);
      }
    );
  });
}

module.exports = {
  register,
  login,
};
