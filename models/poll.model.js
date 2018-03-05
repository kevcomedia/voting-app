const mongoose = require('mongoose');
const {Schema} = mongoose;

const pollSchema = new Schema({
  question: {
    type: String,
    required: true,
  },
  choices: [
    {
      label: {
        type: String,
        required: true,
      },
      voters: [
        {
          // Use a ref to a User document later
          type: String,
          required: true,
        },
      ],
    },
  ],
  meta: {
    owner: {
      // Use a ref to a User document later
      type: String,
      required: true,
    },
    dateCreated: {
      type: Date,
      default: Date.now,
    },
  },
});

module.exports = mongoose.model('Poll', pollSchema);
