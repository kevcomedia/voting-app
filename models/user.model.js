const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.pre('save', function(next) {
  const saltRounds = 10;
  bcrypt.hash(this.password, saltRounds).then(hash => {
    this.password = hash;
    next();
  });
});

userSchema.statics.createUser = function({username, password} = {}) {
  if (!username) {
    const err = new Error('Username cannot be blank');
    err.name = 'UsernameBlankError';
    return Promise.reject(err);
  }

  return this.findOne({username}).then(existingUser => {
    if (existingUser) {
      const err = new Error('Username is already taken');
      err.name = 'UsernameTakenError';
      return Promise.reject(err);
    }

    const minPasswordLength = 10;
    if (password.length < minPasswordLength) {
      const err = new Error(
        `Password should be at least ${minPasswordLength} characters long`
      );
      err.name = 'InvalidPasswordLengthError';
      return Promise.reject(err);
    }

    return Promise.resolve(this.create({username, password}));
  });
};

module.exports = mongoose.model('User', userSchema);
