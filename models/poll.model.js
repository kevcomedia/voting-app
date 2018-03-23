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
      type: ObjectId,
      required: true,
      ref: 'User',
    },
    dateCreated: {
      type: Date,
      default: Date.now,
    },
  },
});

module.exports = mongoose.model('Poll', pollSchema);
