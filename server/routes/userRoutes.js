const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/register', authController.register);

module.exports = router;
