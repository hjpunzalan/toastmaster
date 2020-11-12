const AWS = require("aws-sdk");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const connectToS3 = () => {
	return new AWS.S3({
		accessKeyId: process.env.S3_ACCESS_KEY,
		secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
	});
};

exports.uploadToS3 = catchAsync(async (req, res, next) => {
	// Todo fix s3 upload with version for each upload deleting previous version
	// This fixes identical photo addresses with persistent cached image
	// Update the key to include version with custom versioning
	// SignedURL gives no response, must use custom versioning!
	// Delete previous version
	const imageType = req.body.type.replace("image/", "");

	// Establish old version
	// Delete null versions if previously set already
	let oldVersion = null;
	if (req.user.photo.includes("-v")) {
		oldVersion = parseInt(
			req.user.photo.split(`-v`)[1].split(`.${imageType}`)[0]
		);
	}

	// Set params
	const s3 = connectToS3();
	const key = `${req.user.id}/photo-v${oldVersion + 1}.${imageType}`;
	const params = {
		Bucket: "toastmaster-user-photo",
		ContentType: req.body.type,
		Key: key,
	};

	// Provide url to upload object to s3 bucket
	// Prevents sending large image file to server and instead,
	//is sent directly to AWS
	await s3.getSignedUrl("putObject", params, async (err, url) => {
		// Delete previous version
		// WARNING: Must be called together with signedURL from client!!

		if (req.user.photo) {
			const oldVersionParams = {
				Bucket: "toastmaster-user-photo",
				Key: `${req.user.id}/photo-v${oldVersion}.${imageType}`,
			};
			await s3.deleteObject(oldVersionParams, (err, data) => {
				if (err) {
					return next(new AppError("Something went wrong...", 500));
				}
				console.log(data);
			});
		}

		// Send url
		res.status(200).json({ key, url });
	});
});
