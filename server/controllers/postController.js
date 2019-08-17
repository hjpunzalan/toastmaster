const Posts = require('../models/Posts');
const catchAsync = require('../utils/catchAsync');
const QueryHandling = require('../utils/queryHandling')

exports.createPost = catchAsync(async (req, res, next) => {
	const newPost = await Posts.create(req.body);
	res.status(201).json(newPost);
});

exports.getAllPosts = catchAsync(async (req, res, next) => {
	const query = Posts.find();
	const features = new QueryHandling(query, req.query).sort().paginate();
	const allPosts = await features.query;

	res.status(200).json({
		results: allPosts.length,
		posts: allPosts
	});
});