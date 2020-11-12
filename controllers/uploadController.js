const AWS = require("aws-sdk");
const catchAsync = require("../utils/catchAsync");

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
		if (req.user.photo.includes("-versionId=")) {
		oldVersion = req.user.photo.split(`-versionId=`)[1];
	}
	

	// Set params
	const s3 = connectToS3();
	const key = `${req.user.id}/photo-versionId=${oldVersion+1}.${imageType}`;
	const params = {
		Bucket: "toastmaster-user-photo",
		ContentType: req.body.type,
		Key: key,
	};

	// Provide url to upload object to s3 bucket
	// Prevents sending large image file to server and instead,
	//is sent directly to AWS
	await s3.getSignedUrl("putObject", params, (err, url) => {
		// Delete previous version
		// WARNING: Must be called together with signedURL from client!!
		
		if(req.user.photo){
		await s3.deleteObject({ ...params, VersionId: oldVersion }, (err, data) => {
			if (err) {
				console.error(err);
					return next(new AppError("Something went wrong...", 500));
			}
		})}

		// Send url
		res.status(200).json({ key, url });
	});
});
