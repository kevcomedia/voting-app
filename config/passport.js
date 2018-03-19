const passport = require('passport');
const {ExtractJwt, Strategy: JwtStrategy} = require('passport-jwt');
const User = require('../models/user.model');

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
  secretOrKey: process.env.JWT_SECRET_KEY || 'use a proper key',
};

passport.use(
  'jwt',
  new JwtStrategy(jwtOptions, function(jwtPayload, next) {
    User.findOne({username: jwtPayload.username})
      .then(user => {
        next(null, user || false);
      })
      .catch(next);
  })
);
