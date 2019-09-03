const AWS = require('aws-sdk');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const connectToS3 = () => {
	return new AWS.S3({
		accessKeyId: process.env.S3_ACCESS_KEY,
		secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
	});
};

exports.uploadToS3 = catchAsync(async (req, res, next) => {
	const s3 = connectToS3();
	const key = `${req.user.id}/photo.jpeg`;
	const params = {
		Bucket: 'toastmaster-user-photo',
		ContentType: 'image/jpeg',
		Key: key
	};
	await s3.getSignedUrl('putObject', params, (err, url) => {
		res.status(200).json({ key, url });
	});
});