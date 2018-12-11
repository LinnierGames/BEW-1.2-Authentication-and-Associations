var express = require('express');
var router = express.Router({ mergeParams: true });

const Posts = require('../models/posts')
const Comments = require('../models/comments')

router.post('/', function(req, res, next) {
	Posts.findById(req.params.postId, (error, post) => {
		if (error) {
			console.log(error)

			return next()
		}
		
		Comments.create(req.body, (error, newComment) => {
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
