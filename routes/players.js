const express = require('express');
const router = express.Router();
const Player = require('../models/player');
const Team = require('../models/team');
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif'];

// All TEAM ROUTE
router.get('/', async (req, res) => {
  let query = Player.find();
  if (req.query.name != null && req.query.name != '') {
    query = query.regex('name', new RegExp(req.query.name, 'i'));
  }
  try {
    const players = await query.exec();
    console.log(req.query);
    res.render('players/index', { players: players, searchOptions: req.query });
  } catch {}
});
// NEW TEAM ROUTE
router.get('/new', async (req, res) => {
  renderNewPage(res, new Player());
});

// CREATINNG PLAYER ROUTE
router.post('/', async (req, res) => {
  const player = new Player({
    name: req.body.name,
    team: req.body.team,
    position: req.body.position,
    age: req.body.age,
    draftedIn: new Date(req.body.draftedIn),
    description: req.body.description,
  });
  // req.body.cover because the name of our file input was set to cover
  saveCover(player, req.body.cover);
  try {
    const newPlayer = await player.save();
    res.redirect('players');
  } catch (err) {
    renderNewPage(res, player, true);
  }
});

async function renderNewPage(res, player, hasError = false) {
  try {
    const teams = await Team.find({});
    const params = {
      teams: teams,
      player: player,
    };
    if (hasError) params.errorMessage = 'Error Creating Player';
    res.render('players/new', params);
  } catch {
    res.redirect('/players');
  }
}
function saveCover(player, coverEncoded) {
  if (coverEncoded == null) return;
  const cover = JSON.parse(coverEncoded);
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    // data string cant be sent like that it has to be converted to a buffer
    player.coverImage = new Buffer.from(cover.data, 'base64');
    // this way we can extract this buffer and convert to an image on the correct type
    player.coverImageType = cover.type;
  }
}
module.exports = router;
