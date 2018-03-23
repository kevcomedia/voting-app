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

// When creating Poll documents, just give the `choices` field an array of
// string labels. This setter will convert it to the expected array of
// subdocuments.
pollSchema
  .path('choices')
  .set(choiceLabels => choiceLabels.map(label => ({label})));

module.exports = mongoose.model('Poll', pollSchema);
