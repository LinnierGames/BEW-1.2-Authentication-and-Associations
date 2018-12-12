var express = require('express');
var router = express.Router();
var comments = require('./comments')
const requiresLogin = require('./requires-login')

const Posts = require('../models/posts')
const Users = require('../models/users')
const Comments = require('../models/comments')

router.get('/', function(req, res, next) {
  Posts.find().populate('author').exec((error, posts) => {
    res.render('posts-index', { title: 'Posts', posts });
  })
});

router.get('/new', requiresLogin, function(req, res, next) {
  res.render('posts-new', { title: "New Post" });
});

router.post('/new', requiresLogin, function(req, res, next) {
  var postBody = req.body
  filteredSubreddits = postBody.subreddits.split(",").map(e => e.trim()).filter(e => e != "")
  postBody.subreddits = filteredSubreddits
  postBody.author = req.currentUser._id;
  Posts.create(postBody, (error, newPost) => {
    Users.findById(newPost.author._id, (error, author) => {
      author.posts.unshift(newPost)
      author.save()
        .then((newAuthor) => {
          res.redirect(`/posts/${newPost._id}`)
        })
        .catch((error) => {
          next()
        })
    })
  })
});

router.get('/:postId', function(req, res, next) {
  const popOptions = [
    { path: 'comments', populate: { path: 'comments', populate: { path: 'comments' }}}
  ]
  Posts.findById(req.params.postId)
    .populate({
      path: 'comments',
      populate: { path: 'author' }
    })
    .populate('author')
    .then((post) => {
      Comments.populate(post.comments, popOptions, (error, popComments) => {
        post.comments = popComments
        res.render('posts-show', { title: post.title, post, comments: post.comments });
      })
    })
    .catch((error) => {
      if (error) {
        console.log(error)

        return next()
      }
    })
});

// SUBREDDIT
router.get("/r/:subreddit", function(req, res) {
  const subreddit = req.params.subreddit

  Posts.find({ subreddits: subreddit}, (error, posts) => {
    res.render('posts-index', { title: `Posts for ${subreddit}`, posts });
  })
});

router.use("/:postId/comments", comments);

module.exports = router;
