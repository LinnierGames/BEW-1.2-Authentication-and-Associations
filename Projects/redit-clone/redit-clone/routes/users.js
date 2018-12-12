var express = require('express');
const requiresLogin = require('./requires-login')
const Users = require('../models/users')

var router = express.Router();

/* GET users listing. */
router.get('/profile', requiresLogin, function(req, res, next) {
  res.send('show the current users profile' + req.user);
});

router.get('/users/:username', function(req, res, next) {
  Users.findOne({ username: req.params.username}, (error, user) => {
    if (error) {
      return next()
    }

    res.send('show the specified user' + user);
  })
});

module.exports = router;
