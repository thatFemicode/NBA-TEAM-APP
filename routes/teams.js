const express = require('express');
const router = express.Router();
const Team = require('../models/team');

// All TEAM ROUTE
router.get('/', async (req, res) => {
  let searchOptions = {};
  if (req.query.teamName !== null && req.query.teamName !== '') {
    searchOptions.teamName = new RegExp(req.query.teamName, 'i');
  }
  try {
    const teams = await Team.find(searchOptions);
    res.render('teams/index', { teams: teams, searchOptions: req.query });
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
  try {
    // this is to save the teams in the databse
    const newTeam = await team.save();
    res.redirect('teams');
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
module.exports = router;
