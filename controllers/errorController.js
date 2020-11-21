const AppError = require("../utils/appError");

const handleCastErrorDB = (err) => {
	const message = `Invalid ${err.path}: ${err.value}.`; //Invalid _id : wwwwwwww
	return new AppError(message, 400);
};
const handleDuplicateFieldsDB = (err) => {
	const value = Object.values(err.keyValue)[0];
	const message = `${value} is already taken. Please use another value!`;
	return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
	// Object.values converts object property values into an array with the object as argument
	// err.errors return an object of errors with properties where theres validation errors
	const errors = Object.values(err.errors)
		.map((el) => el.message)
		.join(". ");
	console.log(errors);

	// Join array into a single string
	const message = `Invalid input data. ${errors}`;
	return new AppError(message, 400);
};
const handleJWTError = (err) => {
	return new AppError("Invalid token. Please log in again!", 401);
};

const sendErrorDev = (err, res) => {
	res.status(err.statusCode).json({
		status: err.status,
		message: err.message,
		error: err,
		stack: err.stack, // stack trace
	});
};

const sendErrorProd = (err, res) => {
	// Operational, trusted error: send message to client
	// Production mode: Only send meaningful,concise and easy to understand errors
	if (err.isOperational) {
		res.status(err.statusCode).json({
			status: err.status,
			message: err.message,
		});
		// Programming or other unknown errors
	} else {
		// 1) Log error
		console.error("ERROR", err);
		// 2) Send generic message
		res.status(500).json({
			status: "error",
			message: "Something went very wrong",
		});
	}
};

module.exports = (err, req, res, next) => {
	err.status = err.status || "error";
	err.statusCode = err.statusCode || 500;

	if (process.env.NODE_ENV === "development") {
		sendErrorDev(err, res);
	} else {
		let newError = { ...err };
		if (err.name === "CastError") newError = handleCastErrorDB(newError);
		else if (err.code === 11000) newError = handleDuplicateFieldsDB(newError);
		else if (err.name === "ValidationError")
			newError = handleValidationErrorDB(newError);
		else if (err.name === "JsonWebTokenError")
			newError = handleJWTError(newError);
		else {
			// in production mode, destructuring doesnt work with error
			sendErrorProd(err, res);
			return next();
		}
		sendErrorProd(newError, res);
	}
};
