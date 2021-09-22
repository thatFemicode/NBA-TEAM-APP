const express = require('express');
const router = express.Router();
const Team = require('../models/team');
const Player = require('../models/player');
const imageMimeTypes = [
  'image/jpeg',
  'image/png',
  'images/gif',
  'image/svg+xml',
];

// All TEAM ROUTE
router.get('/', async (req, res) => {
  let searchOptions = {};
  if (req.query.teamName !== null && req.query.teamName !== '') {
    searchOptions.teamName = new RegExp(req.query.teamName, 'i');
  }
  try {
    const teams = await Team.find(searchOptions);
    res.render('teams/index', { teams: teams, searchOptions: req.query });
    // console.log(teams, cover);
  } catch {
    res.redirect('/');
  }
});
// NEW TEAM ROUTE
router.get('/new', (req, res) => {
  res.render('teams/new', { team: new Team() });
});

// CREATINNG AUTHOR ROUTE
router.post('/', async (req, res) => {
  const team = new Team({
    teamName: req.body.teamName,
    location: req.body.location,
    arena: req.body.arena,
    tag: req.body.tag,
  });
  saveCover(team, req.body.cover);

  try {
    // this is to save the teams in the databse
    const newTeam = await team.save();
    // res.redirect('teams');
    res.redirect(`teams/${newTeam.id}`);
  } catch (err) {
    res.render('teams/new', {
      team: team,
      errorMessage: 'Error Creating Team',
    });
  }
  // team.save((err, newTeam) => {
  //   if (err) {
  //     res.render('teams/new', {
  //       team: team,
  //       errorMessage: 'Error Creating Team',
  //     });
  //   } else {
  //     res.redirect('teams');
  //   }
  // });
});
router.get('/:id', async (req, res) => {
  // console.log(req.params.id);
  try {
    const team = await Team.findById(req.params.id);
    const players = await Player.find({ team: team.id }).limit(7).exec();
    res.render('teams/show', {
      team: team,
      playersInTeam: players,
    });
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
});
router.get('/:id/edit', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    res.render('teams/edit', { team });
  } catch {
    res.redirect('teams');
  }
});
router.put('/:id', async (req, res) => {
  // team variable must be available inside try and catch method
  let team;
  // saveCover(team, req.body.cover);
  try {
    team = await Team.findById(req.params.id);
    team.teamName = req.body.teamName;
    team.location = req.body.location;
    team.arena = req.body.arena;
    team.tag = req.body.tag;
    await team.save();
    res.redirect(`/teams/${team.id}`);
    // this is to save the teams in the databse
  } catch (err) {
    console.log(err);
    if (team == null) {
      res.redirect('/');
    } else {
      res.render('teams/edit', {
        team: team,
        errorMessage: 'Error Updating Team',
      });
    }
  }
});
router.delete('/:id', async (req, res) => {
  // team variable must be available inside try and catch method
  let team;
  // saveCover(team, req.body.cover);
  try {
    team = await Team.findById(req.params.id);
    await team.remove();
    res.redirect(`/teams/${team.id}`);
    // this is to save the teams in the databse
  } catch (err) {
    console.log(err);
    if (team == null) {
      res.redirect('/');
    } else {
      res.redirect(`/teams/${team.id}`);
    }
  }
});

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
