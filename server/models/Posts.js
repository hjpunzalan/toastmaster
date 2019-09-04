const mongoose = require('mongoose');
const autoPopulate = require('mongoose-autopopulate');

const postSchema = new mongoose.Schema({
	user: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: 'Users',
		autopopulate: true
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
		required: [true, 'A post must have content.']
	},
	plainText: {
		type: String,
		required: true
	},
	comments: [
		{
			user: {
				type: mongoose.SchemaTypes.ObjectId,
				ref: 'Users',
				autopopulate: true
			},
			date: {
				type: Date,
				default: Date.now
			},
			contentState: {
				type: Object,
				required: [true, 'A comment must have content.']
			}
		}
	],
	lastComment: Date,
	lastEdited: Date
});
postSchema.plugin(autoPopulate);

//Model.update,findByIdAndUpdate,findOneAndUpdate,findOneAndRemove,findByIdAndRemove are all commands executed directly in the database
postSchema.pre(/^find/, function(next) {
	this.find().select('-__v');
	next();
});

postSchema.post('save', async function(doc, next) {
	await doc
		.populate({
			path: 'comments.user'
		})
		.populate('user')
		.execPopulate();
	next();
});
// /schema methods are only available when there's a single result.!

const Posts = mongoose.model('Posts', postSchema);

module.exports = Posts;
