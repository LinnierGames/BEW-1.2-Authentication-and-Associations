var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new Schema({  
	content: { type: String, required: true },
	author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
	comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
	
	createdAt: { type: Date },
	updatedAt: { type: Date }
});

// PostSchema.virtual("subredits")
// 	.get(() => {
// 		return 
// 	})

CommentSchema.pre("save", function(next) {
	// SET createdAt AND updatedAt
	const now = new Date();
	this.updatedAt = now;
  
	if (!this.createdAt) {
	  this.createdAt = now;
	}
  
	next();
  });

module.exports = mongoose.model('Comment', CommentSchema);