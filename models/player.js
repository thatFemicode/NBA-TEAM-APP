const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  age: {
    type: Number,
    required: true,
  },
  draftedIn: {
    type: Date,
    required: true,
    default: Date.now,
  },
  //   coverImage: {
  //     type: Buffer,
  //     required: true,
  //   },
  //   coverImageType: {
  //     type: String,
  //     required: true,
  //   },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Team',
  },
});
module.exports = mongoose.model('Player', playerSchema);
