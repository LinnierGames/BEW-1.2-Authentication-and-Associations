var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = new Schema({  
	title: { type: String, required: true },
	url: { type: String, required: true },
	summary: { type: String, required: true },
	
	createdAt: { type: Date },
	updatedAt: { type: Date }
});

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