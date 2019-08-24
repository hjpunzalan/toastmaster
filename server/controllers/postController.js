const Posts = require('../models/Posts');
const catchAsync = require('../utils/catchAsync');
const QueryHandling = require('../utils/queryHandling');
const AppError = require('../utils/appError');
const checkBody = require('../utils/checkBody');

const findPost = async (id, next) => {
	const post = await Posts.findById(id);
	if (!post) {
		return next(new AppError('No post was found with this Id.', 404));
	} else {
		return post;
	}
};

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
	const post = await findPost(req.params.id, next);
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
	const post = await findPost(req.params.id, next);
	await post.remove();

	res.status(204).json({
		status: 'success'
	});
});

exports.addComment = catchAsync(async (req, res, next) => {
	const post = await Posts.findById(req.params.id);
	if (!post) {
		return next(new AppError('No post was found with this Id.', 404));
	}
	const newComment = {
		user: req.user.id,
		contentState: req.body.contentState
	};

	post.comments.push(newComment);
	await post.save();
	res.status(200).json(post.comments);
});

exports.deleteComment = catchAsync(async (req, res, next) => {
	const post = await findPost(req.params.postId, next);
	const newComments = post.comments.filter(c => c._id != req.params.commentId); //req.params is a number
	if (post.comments.length === newComments.length) {
		return next(new AppError('Comment not found.', 404));
	}
	post.comments = newComments;
	await post.save();

	res.status(200).json(post);
});
