var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = new Schema({  
	title: { type: String, required: true },
	url: { type: String, required: true },
	summary: { type: String, required: true },
	subreddits: { type: [String], required: true },
	
	author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
	
	createdAt: { type: Date },
	updatedAt: { type: Date }
});

// PostSchema.virtual("subredits")
// 	.get(() => {
// 		return 
// 	})

PostSchema.pre("save", function(next) {
	// SET createdAt AND updatedAt
	const now = new Date();
	this.updatedAt = now;
  
	if (!this.createdAt) {
	  this.createdAt = now;
	}
  
	next();
  });

module.exports = mongoose.model('Post', PostSchema);