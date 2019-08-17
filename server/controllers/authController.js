const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Users = require('../models/Users');

exports.login = catchAsync(async (req, res, next) => {
	// email
	// password
	const { email, password } = req.body;

	// Check if email or password exist
	if (!email || !password)
		next(new AppError('Please enter an valid email address and password', 401));

	const user = await Users.findOne({ email }).select('+password');

	if (!user || !user.checkPassword(password, user.password))
		next(new AppError('Invalid user credentials', 401));

	user.password = undefined;

	res.status(200).json(user);
});
