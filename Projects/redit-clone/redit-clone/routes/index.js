var express = require('express');
var router = express.Router();

const Posts = require('../models/posts')

router.get('/', function(req, res, next) {
  Posts.find((error, posts) => {
    res.render('index', { title: 'Redit Clone!', posts, currentUser: req.user });
  })
});

module.exports = router;
