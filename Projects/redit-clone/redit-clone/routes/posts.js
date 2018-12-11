var express = require('express');
var router = express.Router();

const Posts = require('../models/posts')

router.get('/', function(req, res, next) {
  Posts.find((error, posts) => {
    res.render('posts-index', { title: 'Posts', posts });
  })
});

router.get('/new', function(req, res, next) {
  res.render('posts-new', { title: "New Post" });
});

router.post('/new', function(req, res, next) {
  var postBody = req.body
  filteredSubreddits = postBody.subreddits.split(",").map(e => e.trim()).filter(e => e != "")
  postBody.subreddits = filteredSubreddits
  Posts.create(postBody, (error, newPost) => {
    res.redirect("/posts/")
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

// SUBREDDIT
router.get("/r/:subreddit", function(req, res) {
  const subreddit = req.params.subreddit

  Posts.find({ subreddits: subreddit}, (error, posts) => {
    res.render('posts-index', { title: `Posts for ${subreddit}`, posts });
  })
});

module.exports = router;
