module.exports = fn => {
	// pass all arguments then catch errors
	// returns Promise
	return (req, res, next) => {
		/// an event listener
		fn(req, res, next).catch(next); // goes towards global error handler ..........err => next(err)
	};
};
