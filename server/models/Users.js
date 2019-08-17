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
		select: false,
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
	}
});

// Middleware
userSchema.pre(/^find/, function(next) {
	// 'this' points to the current query before executing the event /^find/
	this.find({ active: { $ne: false } });
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

const Users = mongoose.model('Users', userSchema);

module.exports = Users;
