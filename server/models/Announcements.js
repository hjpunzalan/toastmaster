const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
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
	lastEdited: Date
});

const Announcements = mongoose.model('Announcements', announcementSchema);

module.exports = Announcements;
