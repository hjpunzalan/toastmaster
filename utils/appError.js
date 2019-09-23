class AppError extends Error {
	constructor(message, statusCode) {
		//Object created from this class when calling an instance
		super(message); //From Error class

		this.statusCode = statusCode;
		this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
		this.isOperational = true; // To identify operational errors from programming errors, Only operational errors are handled by this class

		Error.captureStackTrace(this, this.constructor);
	}
}

module.exports = AppError;
