const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/register').post(authController.protect, userController.register);

router.route('/').get(userController.getAllUsers);

module.exports = router;
