const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post(
	'/register',
	authController.restrictTo('admin', 'committee'),
	userController.register
);

router.route('/').get(userController.getAllUsers);
router.route('/unactive').get(userController.getUnActiveUsers);
router.post('/updatePassword', authController.updatePassword);
router.patch('/updateMe', userController.updateMe);
router.patch('/deleteMe', userController.deleteMe);
router.patch(
	'/deleteUser/:id',
	authController.restrictTo('admin', 'committee'),
	userController.deleteUser
);

module.exports = router;
