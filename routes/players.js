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
    res.redirect(`players/${newPlayer.id}`);
  } catch (err) {
    console.log(err);
    renderNewPage(res, player, true);
  }
});
router.get('/:id', async (req, res) => {
  try {
    const player = await Player.findById(req.params.id).populate('team').exec();
    res.render('players/show', { player: player });
  } catch {
    res.redirect('/');
  }
});
router.get('/:id/edit', async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    renderEditPage(res, player);
  } catch (err) {
    res.redirect('/');
  }
});
router.put('/:id', async (req, res) => {
  let player;
  try {
    player = await Player.findById(req.params.id);
    player.name = req.body.name;
    player.team = req.body.team;
    player.position = req.body.position;
    player.age = req.body.age;
    player.draftedIn = new Date(req.body.draftedIn);
    player.description = req.body.description;
    if (req.body.cover != null && req.body.cover !== '') {
      saveCover(player, req.body.cover);
    }
    await player.save();
    res.redirect(`/players/${player.id}`);
  } catch (err) {
    console.log(err);
    if (player != null) {
      renderEditPage(res, player, true);
    } else {
      redirect('/');
    }
  }
});
router.delete('/:id', async (req, res) => {
  let player;
  try {
    player = await Player.findById(req.params.id);
    await player.save();
    res.redirect(`/players`);
  } catch (err) {
    if (player != null) {
      res.render('/players/show', {
        player: player,
        errorMessage: 'Player cannot be removed',
      });
    } else {
      redirect('/');
    }
  }
});
async function renderNewPage(res, player, hasError = false) {
  renderFormPage(res, player, 'new', hasError);
}
async function renderEditPage(res, player, hasError = false) {
  renderFormPage(res, player, 'edit', hasError);
}
async function renderFormPage(res, player, form, hasError = false) {
  try {
    const teams = await Team.find({});
    const params = {
      teams: teams,
      player: player,
    };
    if (hasError) {
      if (form === 'edit') {
        params.errorMessage = 'Error Updating Player';
      } else {
        params.errorMessage = 'Error Creating Team';
      }
    }
    res.render(`players/${form}`, params);
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
