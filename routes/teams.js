const express = require('express');
const router = express.Router();
const Team = require('../models/team');

// All TEAM ROUTE
router.get('/', (req, res) => {
  res.render('teams/index');
});
// NEW TEAM ROUTE
router.get('/new', (req, res) => {
  res.render('teams/new', { team: new Team() });
});

// CREATINNG AUTHOR ROUTE
router.post('/', (req, res) => {
  const team = new Team({
    teamName: req.body.teamName,
    location: req.body.locationA,
    arena: req.body.arena,
    tag: req.body.tag,
  });
  author.save((err, newTeam) => {
    if (err) {
      res.render('/team/new', {
        team: team,
        errorMessage: 'Error Creating Team',
      });
    } else {
      res.redirect('teams');
    }
  });
});
module.exports = router;
