const Users = require('../models/Users');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.register = catchAsync(async (req, res, next) => {
	const newUser = await Users.create(req.body);
	// first name,
	// last name,
	// email
	// password

	// remove password from json output;
	newUser.password = undefined;

	// need to send an email with default password of user
	// password must only be seen by the user and not the admin that registered user
	res.status(201).json(newUser);
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
	const users = await Users.find();
	res.status(200).json(users);
});
