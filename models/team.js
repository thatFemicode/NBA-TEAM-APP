const mongoose = require('mongoose');
const Player = require('./player');
const teamSchema = new mongoose.Schema({
  teamName: {
    type: String,
    required: true,
  },
  arena: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    required: true,
  },
  coverImage: {
    type: Buffer,
    required: true,
  },
  coverImageType: {
    type: String,
    required: true,
  },
});
// pre allows us to run a method before actions
// we are trying to create something where we cant delete a team when it has players
teamSchema.pre('remove', function (next) {
  Player.find({ team: this.id }, (err, player) => {
    if (err) {
      next(err);
    } else if (player.length > 0) {
      next(new Error('This Team has players'));
    } else {
      next();
    }
  });
});
teamSchema.virtual('coverImagePath').get(function () {
  if (this.coverImage != null && this.coverImageType != null) {
    return `data:${
      this.coverImageType
    };charset=utf-8;base64,${this.coverImage.toString('base64')}`;
  }
});
module.exports = mongoose.model('Team', teamSchema);
