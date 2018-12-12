var express = require('express');
var router = express.Router({ mergeParams: true });
const requiresLogin = require('./requires-login')

const Posts = require('../models/posts')
const Comments = require('../models/comments')

router.post('/', requiresLogin, function(req, res, next) {
	Posts.findById(req.params.postId, (error, post) => {
		if (error) {
			console.log(error)

			return next()
		}
		var commentBody = req.body
		commentBody.author = req.currentUser._id
		
		Comments.create(commentBody, (error, newComment) => {
			if (error) {
				console.log(error)

				return next()
			}

			post.comments.unshift(newComment._id)
			post.save((error, savedPost) => {
				if (error) {
					console.log(error)
		
					return next()
				}

				res.redirect("/")
			})
		})
	})
});

module.exports = router;
