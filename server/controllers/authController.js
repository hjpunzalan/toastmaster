const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const tokenHandler = require('../utils/tokenHandler');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Users = require('../models/Users');
const sendEmail = require('../utils/email');

exports.login = catchAsync(async (req, res, next) => {
	// email
	// password
	const { email, password } = req.body;

	// Check if email or password exist
	if (!email || !password)
		return next(
			new AppError('Please enter an valid email address and password', 401)
		);

	const user = await Users.findOne({ email }).select('+password');

	if (!user || !(await user.checkPassword(password, user.password)))
		return next(new AppError('Invalid user credentials', 401));

	// Make inactive users active
	if (!user.active) {
	}

	// remove users password from response
	user.password = undefined;

	const token = tokenHandler.createToken(user._id);
	res.status(200).json({
		user,
		token
	});
});

exports.protect = catchAsync(async (req, res, next) => {
	// Get token and check if it exist
	// req.headers.authorization shows: Bearer *token
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		token = req.headers.authorization.split(' ')[1]; // second array contains token first one contains Bearer
	}

	if (!token)
		return next(
			new AppError('You are not logged in! Please login to get access', 401)
		);

	// Verify token
	// jwt.verify(token, secretOrPublicKey, [options, callback])
	//acts synchronously without callback therefore we want to use promisfy to keep a consistent async code where sync code is executed first
	const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

	// Check if user exist
	const payload = decoded.id;
	const user = await Users.findById(payload);
	if (!user)
		return next(
			new AppError('The user belonging to the token no longer exist', 401)
		);

	//Check if user changed password after the token was issued
	if (user.changedPasswordAfter(decoded.iat)) {
		return next(
			new AppError('User recently changed password. Please log in again', 401)
		);
	}

	// Grant access to the user who holds the token (through payload)
	// Stores user information for next middleware
	req.user = user;
	next();
});

// Wrapper function to add arguments in middlewares from router
// ...roles is an array ['admin', 'lead-guide] of arguments
// middleware function has access to roles because of closure
exports.restrictTo = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return next(
				new AppError('You do not have permission to perform this action', 403)
			); // 403 means forbidden
		}
		next();
	};
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
	//  Get user based on POSTed email
	const user = await Users.findOne({ email: req.body.email });
	if (!user) {
		return next(new AppError('There is no user with this email address', 404));
	}
	// Generate the random rest token
	const resetToken = user.createPasswordResetToken();
	await user.save({ validateBeforeSave: false }); // modified the user document ... disabled validators before save

	// Send it to user's email
	const resetURL = `${req.protocol}://${req.get(
		'host'
	)}/api/auth/resetPassword/${resetToken}`;

	const message = `Forgot your password? Submit a PATCH request with your new password to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

	// Not enough to catch error in global error handling.
	// Need to send back the reset password token and expiration
	try {
		await sendEmail({
			email: user.email,
			subject: 'Your password reset token (valid for 10min)',
			message
		});
	} catch (error) {
		user.passwordResetToken = undefined;
		user.passwordResetExpires = undefined;
		await user.save({ validateBeforeSave: false });
		return next(
			new AppError('There was an error sending the email. Try again later', 500)
		);
	}

	res.status(200).json({
		status: 'success',
		message: 'Token sent to email!'
	});
});

exports.resetPassword = catchAsync(async (req, res, next) => {
	// 1) Get user based on the token
	// sha256 is the name of the algorithm
	const hashedToken = crypto
		.createHash('sha256')
		.update(req.params.token)
		.digest('hex');

	//// If expiry is greater than now(or undefined), than its not expired
	// Finds user
	const user = await Users.findOne({
		passwordResetToken: hashedToken,
		passwordResetExpires: { $gt: Date.now() } // mongoDB can convert different format into the same to compare eg. miliseconds
	});

	// 2) If token has not expired, and there is user, set the new password
	// Check if user is found
	if (!user) {
		return next(new AppError('Token is invalid or has expired', 400));
	}

	// modify data
	user.password = req.body.password;
	user.passwordResetToken = undefined;
	user.passwordResetExpires = undefined;
	await user.save(); // use save to run validators again because find and update wont

	// 3) Update changePasswordAt proprety for the user
	// DONE

	// 4) Log the user in, send JWT
	const token = tokenHandler.createToken(user._id);
	res.status(200).json({
		status: 'success',
		jwt: token
	});
});
