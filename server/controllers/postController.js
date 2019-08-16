const Posts = require('../models/Posts');

exports.createPost = async (req, res, next) => {
	try {
		const newPost = await Posts.create(req.body);

		res.status(201).json(newPost);
	} catch (error) {
		res.status(500).json({
			status: 'Error',
			message: error
		});
	}
};
