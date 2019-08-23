const express = require('express');
const postController = require('../controllers/postController');

const router = express.Router();

router
	.route('/')
	.post(postController.createPost)
	.get(postController.getAllPosts);

router
	.route('/:id')
	.get(postController.getPost)
	.patch(postController.editPost)
	.delete(postController.deletePost);

module.exports = router;
