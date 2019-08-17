const AppError = require('../utils/appError');

const handleCastErrorDB = err => {
	const message = `Invalid ${err.path}: ${err.value}.`; //Invalid _id : wwwwwwww
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
		sendErrorProd(newError, res);
	}

	next();
};
