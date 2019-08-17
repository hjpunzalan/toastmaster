const Posts = require('../models/Posts');
const catchAsync = require('../utils/catchAsync');

exports.createPost = catchAsync(async (req, res, next) => {
	const newPost = await Posts.create(req.body);
	res.status(201).json(newPost);
});
