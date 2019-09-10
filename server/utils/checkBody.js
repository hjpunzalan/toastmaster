const AppError = require('./appError');

module.exports = (body, next, allowedFields) => {
	const newObj = { lastEdited: Date.now() - 1000 };
	Object.keys(body).forEach(el => {
		if (allowedFields.includes(el)) newObj[el] = body[el];
		else return next(new AppError('Invalid request fields.', 400));
	});
	return newObj;
};
