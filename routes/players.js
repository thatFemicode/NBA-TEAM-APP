const express = require('express');
const router = express.Router();
const Player = require('../models/player');
const Team = require('../models/team');

// All TEAM ROUTE
router.get('/', async (req, res) => {
  let query = Player.find();
  if (req.query.name != null && req.query.name != '') {
    query = query.regex('name', new RegExp(req.query.name, 'i'));
  }
});
// NEW TEAM ROUTE
router.get('/new', async (req, res) => {
  try {
    const teams = await Team.find({});
    const player = new Player();
    res.render('players/new', {
      teams: teams,
      player: player,
    });
  } catch {
    res.redirect('/teams');
  }
});

// CREATINNG PLAYER ROUTE
router.post('/', async (req, res) => {
  console.log(req.body.name);
  console.log(req.body.position);
  console.log(req.body.team);
  const player = new Player({
    name: req.body.name,
    team: req.body.team,
    position: req.body.position,
    age: req.body.age,
    draftedIn: new Date(req.body.draftedIn),
    description: req.body.description,
  });
  console.log(player);
  try {
    const newPlayer = await player.save();
  } catch (err) {
    console.log(err);
  }
});
module.exports = router;
