const Posts = require('../models/Posts');
const catchAsync = require('../utils/catchAsync');
const QueryHandling = require('../utils/queryHandling');
const AppError = require('../utils/appError');
const checkBody = require('../utils/checkBody');

exports.createPost = catchAsync(async (req, res, next) => {
	const newPost = new Posts({
		user: req.user.id,
		title: req.body.title,
		contentState: req.body.contentState
	});

	await newPost.save();
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

exports.getPost = catchAsync(async (req, res, next) => {
	const post = await Posts.findById(req.params.id);
	res.status(200).json(post);
});

exports.editPost = catchAsync(async (req, res, next) => {
	const filterBody = checkBody(req.body, next, 'title', 'contentState');
	const post = await Posts.findByIdAndUpdate(req.params.id, filterBody, {
		new: true,
		runValidators: true
	});
	if (!post) {
		return next(new AppError('No post was found with this Id.', 404));
	}
	res.status(200).json(post);
});

exports.deletePost = catchAsync(async (req, res, next) => {
	const post = await Posts.findByIdAndRemove(req.params.id);

	if (!post) {
		return next(new AppError('No post was found with this Id.', 404));
	}

	res.status(204).json({
		status: 'success'
	});
});

exports.addComment = catchAsync(async (req, res, next) => {
	const post = await Posts.findById(req.params.id);

	if (!post) {
		return next(new AppError('No post was found with this Id.', 404));
	}
	post.comments.push({
		user: req.user.id,
		contentState: req.body.contentState
	});

	post.save();

	res.status(200).json(post);
});
