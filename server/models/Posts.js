const mongoose = require('mongoose');

const PostsSchema = new mongoose.Schema({
	user: {
		type: String
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
				type: String
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
	]
});

const Posts = mongoose.model('Posts', PostsSchema);

module.exports = Posts;
