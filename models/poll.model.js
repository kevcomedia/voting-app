const mongoose = require('mongoose');
const {Schema} = mongoose;
const {ObjectId} = Schema.Types;

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
          type: ObjectId,
          ref: 'User',
        },
      ],
    },
  ],
  meta: {
    owner: {
      // Let's keep it simple for now; just store the username of the poll
      // owner. We'll look at refs later.
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
