var express = require('express');
const jwt = require('jsonwebtoken');
var router = express.Router();

const Users = require('../models/users')

router.get('/sign-up', function(req, res, next) {
    res.render('sign-up', { title: 'Read-it!' });
});

router.post("/sign-up", (req, res) => {
  Users.create(req.body, (error, newUser) => {
	if (error) {
		console.log(error)

		return next()
	}

	var token = jwt.sign({ _id: newUser._id }, process.env.SECRET, { expiresIn: "60 days" });
	res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });
	res.redirect("/");
  });
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.post("/login", (req, res) => {
	const username = req.body.username;
	const password = req.body.password;
	// Find this user name
	Users.findOne({ username }, "username password")
	  .then(user => {
		if (!user) {
		  // User not found
		  return res.status(401).send({ message: "Wrong Username or Password" });
		}
		// Check the password
		user.comparePassword(password, (err, isMatch) => {
		  if (!isMatch) {
			// Password does not match
			return res.status(401).send({ message: "Wrong Username or password" });
		  }
		  // Create a token
		  const token = jwt.sign({ _id: user._id, username: user.username }, process.env.SECRET, {
			expiresIn: "60 days"
		  });
		  // Set a cookie and redirect to root
		  res.cookie("nToken", token, { maxAge: 900000, httpOnly: true });
		  res.redirect("/");
		});
	  })
	  .catch(err => {
		console.log(err);
	});
});

router.get('/logout', (req, res) => {
	res.clearCookie('nToken');
	res.redirect('/');
});

module.exports = router;
