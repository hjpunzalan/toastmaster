const AppError = require('../utils/appError');

const handleCastErrorDB = err => {
	const message = `Invalid ${err.path}: ${err.value}.`; //Invalid _id : wwwwwwww
	return new AppError(message, 400);
};
const handleDuplicateFieldsDB = err => {
	// regular expressions is always between two slashes '/'
	const value = err.errmsg.match(/(["'])(\\?.)*?\1/); //reg expression between quotation marks
	const message = `Duplicate field value: ${
		//value returns an array
		value[0]
	}. Please use another value!`;
	return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
	// Object.values converts object property values into an array with the object as argument
	// err.errors return an object of errors with properties where theres validation errors
	const errors = Object.values(err.errors)
		.map(el => el.message)
		.join('. ');
	console.log(errors);

	// Join array into a single string
	const message = `Invalid input data. ${errors}`;
	return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
	res.status(err.statusCode).json({
		status: err.status,
		message: err.message,
		error: err,
		stack: err.stack // stack trace
	});
};

const sendErrorProd = (err, res) => {
	// Operational, trusted error: send message to client
	// Production mode: Only send meaningful,concise and easy to understand errors
	if (err.isOperational) {
		res.status(err.statusCode).json({
			status: err.status,
			message: err.message
		});
		// Programming or other unknown errors
	} else {
		// 1) Log error
		console.error('ERROR', err);
		// 2) Send generic message
		res.status(500).json({
			status: 'error',
			message: 'Something went very wrong'
		});
	}
};

module.exports = (err, req, res, next) => {
	err.status = err.status || 'error';
	err.statusCode = err.statusCode || 500;

	if (process.env.NODE_ENV === 'development') {
		sendErrorDev(err, res);
	} else if (process.env.NODE_ENV === 'production') {
		let newError = { ...err };
		if (err.name === 'CastError') newError = handleCastErrorDB(newError);
		if (err.code === 11000) newError = handleDuplicateFieldsDB(newError);
		if (err.name === 'ValidationError')
			newError = handleValidationErrorDB(newError);
		sendErrorProd(newError, res);
	}

	next();
};
