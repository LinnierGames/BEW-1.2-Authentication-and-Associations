var express = require('express');
var router = express.Router();

const Posts = require('../models/posts')

/* GET users listing. */
router.get('/new', function(req, res, next) {
  res.render('posts-new', { title: "New Post" });
});

router.post('/new', function(req, res, next) {
  console.log(req.body.title)
  Posts.create(req.body, (error, newPost) => {
    res.send((error, newPost))
  })
});

module.exports = router;
