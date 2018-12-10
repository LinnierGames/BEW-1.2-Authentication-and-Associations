var express = require('express');
var router = express.Router();

const Posts = require('../models/posts')

router.get('/new', function(req, res, next) {
  res.render('posts-new', { title: "New Post" });
});

router.post('/new', function(req, res, next) {
  console.log(req.body.title)
  Posts.create(req.body, (error, newPost) => {
    res.send((error, newPost))
  })
});

router.get('/:postId', function(req, res, next) {
  Posts.findById(req.params.postId, (error, post) => {
    if (error) {
      return next()
    }
    
    res.render('posts-show', { title: post.title, post });
  })
});

module.exports = router;
