const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
	user: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: 'Users'
	},
	title: {
		type: String,
		required: [true, 'A post must have a title'],
		maxlength: 90
	},
	date: {
		type: Date,
		default: Date.now
	},
	contentState: {
		type: Object,
		required: [true, 'A post must have a contentState']
	},
	comments: [
		{
			user: {
				type: mongoose.SchemaTypes.ObjectId,
				ref: 'Users'
			},
			date: {
				type: Date,
				default: Date.now
			},
			contentState: {
				type: Object,
				required: [true, 'A comment must have a contentState']
			}
		}
	],
	edited: Date
});

postSchema.pre('save', function(next) {
	if (this.isNew) return next();
	if (this.isModified('contentState') || this.isModified('title')) {
		this.edited = Date.now() - 1000; // subtracting 1 second takes into account delay in saving into database so that its before the token is generated
		next();
	} else return next();
});
postSchema.pre(/^find/, function(next) {
	this.find().select('-__v');
	next();
});

// /schema methods are only available when there's a single result.!

const Posts = mongoose.model('Posts', postSchema);

module.exports = Posts;
