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

exports.updateMe = catchAsync(async (req, res, next) => {
	// Create error if user POSTs password datas
	if (req.body.password) {
		return next(new AppError('This route is not for password updates.', 400));
	}
	// Update user document
	const filteredBody = Object.keys(req.body);
	if (filteredBody.includes('firstName') || filteredBody.includes('lastName')) {
		const user = await Users.findByIdAndUpdate(req.user.id, req.body, {
			new: true,
			runValidators: true
		});
		res.status(200).json(user);
	} else {
		return next(new AppError('Invalid user data. Cannot be updated', 400));
	}
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
