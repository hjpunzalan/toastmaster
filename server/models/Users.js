const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: [true, 'User must have a first name']
	},
	lastName: {
		type: String,
		required: [true, 'User must have a last name']
	},
	email: {
		type: String,
		required: [true, 'User must have an email'],
		unique: true,
		lowercase: true, //not a validator but transforms string
		validator: [validator.isEmail, 'Must be a valid email address']
	},
	photo: String,
	password: {
		type: String,
		required: [true, 'User must have a password'],
		minlength: 6,
		select: false //Keeps password hidden from anywhere
	},
	active: {
		type: Boolean,
		default: true,
		select: false
	}
});

const Users = mongoose.model('Users', userSchema);

module.exports = Users;

// Middleware
userSchema.pre(/^find/, function(next) {
	// 'this' points to the current query before executing the event /^find/
	this.find({ active: { $ne: false } });
	next();
});
