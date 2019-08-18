const mongoose = require('mongoose');
const crypto = require('crypto');
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
	role: {
		type: String,
		enum: ['admin', 'committee', 'user'],
		default: 'user'
	},

	passwordChangedAt: Date,
	passwordResetToken: String,
	passwordResetExpires: Date
});

// Middleware
userSchema.pre(/^find/, function(next) {
	// 'this' points to the current query before executing the event /^find/
	this.find({ active: { $ne: false } }).select('-__v');
	next();
});

userSchema.pre('save', async function(next) {
	// Only run this function if password was actually modified
	// Changing password or password creation
	if (!this.isModified('password')) return next();

	const saltRounds = 12;
	this.password = await bcrypt.hash(this.password, saltRounds);

	next();
});

userSchema.methods.checkPassword = async function(password, hashedPassword) {
	return await bcrypt.compare(password, hashedPassword);
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

userSchema.methods.createPasswordResetToken = function() {
	const resetToken = crypto.randomBytes(32).toString('hex');
	// crypto module that doesn't require much processor
	// Only use bcrypt for passwords

	this.passwordResetToken = crypto
		.createHash('sha256')
		.update(resetToken)
		.digest('hex');

	this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
	return resetToken;
};

const Users = mongoose.model('Users', userSchema);

module.exports = Users;
