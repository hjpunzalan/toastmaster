const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/checkUser', authController.isLoggedIn); // need to be in at the top of app.js client side
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

module.exports = router;
