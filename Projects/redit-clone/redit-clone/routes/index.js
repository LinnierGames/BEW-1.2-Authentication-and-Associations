var express = require('express');
var router = express.Router();

const Posts = require('../models/posts')

router.get('/', function(req, res, next) {
  Posts.find().populate('author')
    .then((posts) => {
      res.render('index', { title: 'Redit Clone!', posts, currentUser: req.user });
    })
    .catch((error) => {
      console.log(error)
      
      next()
    })
});

module.exports = router;
