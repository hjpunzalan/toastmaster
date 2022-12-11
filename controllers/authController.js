const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const Users = require("../models/Users");
const Email = require("../utils/email");

const verifyToken = async (next, token) => {
	// Verify token
	// jwt.verify(token, secretOrPublicKey, [options, callback])
	//acts synchronously without callback therefore we want to use promisfy to keep a consistent async code where sync code is executed first
	const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

	// Check if user exist
	const currentUser = await Users.findById(decoded.id).select(
		"+passwordChangedAt"
	);
	if (!currentUser)
		return next(
			new AppError("The user belonging to the token no longer exist", 401)
		);

	//Check if user changed password after the token was issued
	if (currentUser.changedPasswordAfter(decoded.iat)) {
		return next(
			new AppError("User recently changed password. Please log in again", 401)
		);
	}

	return currentUser;
};

const createToken = (user, res) => {
	// jwt.sign(payload, secretOrPrivateKey, [options, callback])
	const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRATION,
	});

	let cookieOptions = {
		expires: new Date(
			Date.now() + process.env.JWT_COOKIE_EXPIRATION * 24 * 60 * 60 * 1000
		),
		secure: true, // send in https
		httpOnly: true, // cannot be modified by browser
	};
	if (process.env.NODE_ENV !== "production") {
		cookieOptions.secure = false;
	} else cookieOptions.secure = true;
	res.cookie("jwt", token, cookieOptions);
	res.status(200).json(user);
};

exports.login = catchAsync(async (req, res, next) => {
	// email
	// password
	const { email, password } = req.body;

	// Check if email or password exist
	if (!email || !password)
		return next(
			new AppError("Please enter a valid email address and password", 401)
		);

	const user = await Users.findOne({ email }).select("+password");

	if (!user || !(await user.checkPassword(password, user.password)))
		return next(
			new AppError("Invalid email or password. Please try again.", 401)
		);

	if (!user.active) {
		return next(
			new AppError(
				"You're account has been deactivated. Please contact the committee",
				401
			)
		);
	}

	// remove users password from response
	user.password = undefined;

	createToken(user, res);
});

exports.logout = (req, res) => {
	res.clearCookie("jwt");
	res.status(200).json({ status: "success" });
};

exports.protect = catchAsync(async (req, res, next) => {
	// Get token and check if it exist
	// req.headers.authorization shows: Bearer *token
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		token = req.headers.authorization.split(" ")[1]; // second array contains token first one contains Bearer
	} else if (req.cookies.jwt) {
		token = req.cookies.jwt;
	}

	if (!token)
		return next(
			new AppError("You are not logged in! Please login to get access", 401)
		);

	const currentUser = await verifyToken(next, token);

	// Grant access to the user who holds the token (through payload)
	// Stores user information for next middleware
	if (!currentUser.active)
		return next(
			new AppError("You are not logged in! Please login to get access", 401)
		);
	req.user = currentUser;
	next();
});

// Wrapper function to add arguments in middlewares from router
// ...roles is an array ['admin', 'lead-guide] of arguments
// middleware function has access to roles because of closure
exports.restrictTo = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return next(
				new AppError("You do not have permission to perform this action", 403)
			); // 403 means forbidden
		}
		next();
	};
};
//Only for rendered pages, no errors as this is a middleware for checking if user is logged in
// bearer token headers are only sent for api building purposes
exports.checkUser = catchAsync(async (req, res, next) => {
	if (req.cookies.jwt) {
		// Same errors as protect route that validates user from token and sends error message to client
		// Validation only occurs in members page and not in landing page.
		const currentUser = await verifyToken(next, req.cookies.jwt);
		res.status(200).json(currentUser);
	} else {
		return next(new AppError("Only registered users may log in.", 404));
	}
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
	//  Get user based on POSTed email
	const user = await Users.findOne({ email: req.body.email });
	if (!user) {
		return next(new AppError("There is no user with this email address", 404));
	}
	// Generate the random reset token
	const resetToken = user.createPasswordResetToken();
	await user.save({ validateBeforeSave: false }); // modified the user document ... disabled validators before save

	// Not enough to catch error in global error handling.
	// Need to send back the reset password token and expiration
	try {
		const resetURL = req.body.url + "/reset/" + resetToken;

		await new Email(user, resetURL).sendPasswordReset();

		res.status(200).json({
			status: "success",
			message: "Token sent to email!",
		});
	} catch (error) {
		user.passwordResetToken = undefined;
		user.passwordResetExpires = undefined;
		await user.save({ validateBeforeSave: false });
		console.error(error);
		return next(
			new AppError("There was an error sending the email. Try again later", 500)
		);
	}
});

exports.resetPassword = catchAsync(async (req, res, next) => {
	// 1) Get user based on the token
	// sha256 is the name of the algorithm
	// Hash the token from email
	const hashedToken = crypto
		.createHash("sha256")
		.update(req.params.token)
		.digest("hex");

	//// If expiry is greater than now(or undefined), then its not expired
	// Finds user
	const user = await Users.findOne({
		passwordResetToken: hashedToken,
		passwordResetExpires: { $gt: Date.now() }, // mongoDB can convert different format into the same to compare eg. miliseconds
	});

	// 2) If token has not expired, and there is user, set the new password
	// Check if user is found
	if (!user) {
		return next(new AppError("Token is invalid or has expired", 400));
	}

	// modify data
	user.password = req.body.password;
	user.passwordResetToken = undefined;
	user.passwordResetExpires = undefined;
	await user.save(); // use save to run validators again because find and update wont

	// 3) Update changePasswordAt proprety for the user
	// DONE

	// 4) Log the user in, send JWT
	createToken(user, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
	const { currentPassword, newPassword } = req.body;

	// 1) Get user from collection
	// forces select to be true and find if user exist
	// req.user was from protect middleware to make sure user is logged in
	const user = await Users.findById(req.user.id).select("+password");

	// 2) Check if POSTed current password is correct
	if (!(await user.checkPassword(currentPassword, user.password))) {
		return next(
			new AppError("Please enter the correct current password.", 401)
		);
	}

	// 3) If so, update password
	user.password = newPassword;
	// validators in Schema happen after saving into Document
	await user.save();
	// User.findByIdAndUpdate will not work as intended!

	user.password = undefined;

	// 4) Log user in, send JWT
	createToken(user, res);
});
