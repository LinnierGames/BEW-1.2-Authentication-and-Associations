
module.exports = (req, res, next) => {
	if (req.currentUser) {
		next()
	} else {
		res.redirect('/')
	}
}