const mongoose = require('mongoose');
const validator = require('validator');
const generator = require('generate-password');
const bcrypt = require('bcryptjs');

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
		select: false, //Keeps password hidden from anywhere
		minlength: 6,
		required: [true, 'User must have a password'],
		default: generator.generate({
			length: 6,
			numbers: true
		})
	},
	active: {
		type: Boolean,
		select: false,
		default: true
	},
	passwordChangedAt: Date
});

// Middleware
userSchema.pre(/^find/, function(next) {
	// 'this' points to the current query before executing the event /^find/
	this.find({ active: { $ne: false } }).select('-__v');
	next();
});

userSchema.pre('save', async function(next) {
	const saltRounds = 12;
	this.password = await bcrypt.hash(this.password, saltRounds);

	next();
});

userSchema.methods.checkPassword = async function(password, userPassword) {
	return await bcrypt.compare(password, userPassword);
};

userSchema.methods.changedPasswordAfter = function(timestamp) {
	//Assuming timestamp is given in seconds
	if (this.passwordChangedAt) {
		//getTime() is a Date function
		const changedTimeStamp =
			parseInt(this.passwordChangedAt.getTime(), 10) / 1000;
		return changedTimeStamp > timestamp;
	}
	return false;
};

const Users = mongoose.model('Users', userSchema);

module.exports = Users;
