const express = require('express');
const postController = require('../controllers/postController');

const router = express.Router();

router
	.route('/')
	.post(postController.createPost)
	.get(postController.getAllPosts);

module.exports = router;
