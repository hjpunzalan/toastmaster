const express = require('express');
const uploadController = require('../controllers/uploadController');

const router = express.Router();

router.get('/', uploadController.uploadToS3);

module.exports = router;
