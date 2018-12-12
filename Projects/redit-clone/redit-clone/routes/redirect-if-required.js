module.exports = (req, res, fallbackUrl) => {
	const url = req.query.redirect
	if (url && url != "undefined") {
		console.log("redirect", url)
		//TODO: redirect doesn't include the id of a url (?redirect=http://localhost:3000/posts/5c1151287b1d965e549198c2#5c1170f508f81c7a19729282)
		res.redirect(url)
	} else {
		res.redirect(fallbackUrl)
	}
}