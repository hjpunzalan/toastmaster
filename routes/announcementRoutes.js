const express = require('express');
const announcementController = require('../controllers/announcementController');
const authController = require('../controllers/authController.js');

const router = express.Router();

router
	.route('/')
	.post(
		authController.restrictTo('admin', 'committee'),
		announcementController.createAnnouncement
	)
	.get(announcementController.getAllAnnouncements);

router
	.route('/:id')
	.get(announcementController.getAnnouncement)
	.delete(
		authController.restrictTo('admin', 'committee'),
		announcementController.deleteAnnouncement
	)
	.patch(
		authController.restrictTo('admin', 'committee'),
		announcementController.updateAnnouncement
	);

module.exports = router;
