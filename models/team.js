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
  locationA: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model('Team', teamSchema);
