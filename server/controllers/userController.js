const Users = require('../models/Users');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.register = catchAsync(async (req, res, next) => {
	const newUser = await Users.create(req.body);
	// first name,
	// last name,
	// email

	res.status(201).json(newUser);
});
