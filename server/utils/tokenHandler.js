const jwt = require('jsonwebtoken');

exports.createToken = id => {
	// jwt.sign(payload, secretOrPrivateKey, [options, callback])
	const token = jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRATION
	});

	return token;
};

exports.verifyToken = token => {
	// jwt.verify(token, secretOrPublicKey, [options, callback])
};
