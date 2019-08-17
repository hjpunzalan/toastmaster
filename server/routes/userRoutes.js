const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.route('/register', userController.register);

module.exports = router;
