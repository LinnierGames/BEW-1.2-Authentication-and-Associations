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

router.get('/:commentId/reply', requiresLogin, function(req, res, next) {
	Posts.findById(req.params.postId)
		.then((post) => {
			Comments.findById(req.params.commentId)
				.then((comment) => {
					res.render('comment-reply', { parentComment: comment, post: post })
				})
		})
});

router.post('/:commentId/reply', requiresLogin, function(req, res, next) {

	Comments.findById(req.params.commentId)
		.then((parentComment) => {
			Comments.create(req.body)
				.then((newComment) => {
					parentComment.comments.unshift(newComment)
					parentComment.save((error, savedComment) => {
						if (error) {
							console.log(error)

							return next()
						}

						res.redirect(`/posts/${req.params.postId}`)
					})
				})
				.catch((error) => {
					console.log(error)

					return next()
				})
		})
		.catch((error) => {
			console.log(error)

			return next()
		})
});

module.exports = router;
