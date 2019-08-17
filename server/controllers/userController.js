const Users = require('../models/Users');

exports.register = async (req, res, next) => {
	try {
		const newUser = await Users.create(req.body);
		// first name,
		// last name,
		// email
		// password

		res.status(201).json(newUser);
	} catch (error) {
		res.status(500).json({
			status: 'error',
			error
		});
	}
};
