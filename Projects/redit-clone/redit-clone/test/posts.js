const chai = require("chai");
const chaiHttp = require("chai-http");
var server = require("../app");
const should = chai.should();
const Post = require("../models/posts");
const User = require("../models/users");

chai.use(chaiHttp);

var agent = chai.request.agent(server);

//TODO: write more tests (validate properties)

describe("Posts", () => {
	it("should create with valid attributes at POST /posts", done => {
		// TODO: test code goes here!

		agent
			.post("/login")
			.send({ username: "es7", password: "test123" })
			.end(function(err, res) {
				console.log(res.cookies)
				const token = res.cookies["nToken"];

				User.findOne({ username: "es7" }, (error, user) => {
					var post = { title: "post title", author: user._id, url: "https://www.google.com", summary: "post summary" };

					Post.findOneAndRemove(post, function() {
						Post.find(function(err, posts) {
							var postCount = posts.count;
							chai
								.request("localhost:3000")
								.post("/posts/new")
								.set('Cookie', `nToken=${token}`)
								.send(post)
								.then(res => {
									Post.find(function(err, posts) {
										postCount.should.be.equal(posts.length + 1);
										res.should.have.status(200);
										
										return done();
									});
								})
								.catch(err => {
									return done(err);
								});
						});
					});
				})
			});
	});
});
