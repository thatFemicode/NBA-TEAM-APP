const express = require('express');
const router = express.Router();
const Player = require('../models/player');
router.get('/', async (req, res) => {
  let players;
  try {
    players = await Player.find().sort({ name: 1 }).limit(20).exec();
    res.render('index', { players: players });
  } catch (err) {
    console.log(error);
    players = [];
  }
});

module.exports = router;
