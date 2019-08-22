const Users = require('../models/Users');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const checkBody = require('../utils/checkBody');

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

exports.updateMe = catchAsync(async (req, res, next) => {
	// Update user document
	const filterBody = checkBody(req.body, next, 'firstName', 'lastName');
	const user = await Users.findByIdAndUpdate(req.user.id, filterBody, {
		new: true,
		runValidators: true
	});
	res.status(200).json(user);
});

exports.deleteMe = catchAsync(async (req, res, next) => {
	await User.findByIdAndUpdate(req.user.id, { active: false });

	res.status(204);
});

exports.deleteUser = catchAsync(async (req, res, next) => {
	const user = Users.findById(req.params.id);

	user.active = false;
	await user.save();

	res.status(204);
});
