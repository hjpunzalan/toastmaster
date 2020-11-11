const AWS = require("aws-sdk");
const catchAsync = require("../utils/catchAsync");

const connectToS3 = () => {
	return new AWS.S3({
		accessKeyId: process.env.S3_ACCESS_KEY,
		secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
	});
};

exports.uploadToS3 = catchAsync(async (req, res, next) => {
	console.log(req.body);
	// Todo fix s3 upload with version for each upload deleting previous version
	// This fixes identical photo addresses with persistent cached image
	// update the key to include version
	// Delete previous version
	// REMOVE PRE SIGNED URL
	const s3 = connectToS3();
	const key = `${req.user.id}/photo.${req.body.type.replace("image/", "")}`;
	let params = {
		Bucket: "toastmaster-user-photo",
		ContentType: req.body.type,
		Key: key,
	};

	// Put photo into bucket as an object
	await s3.putObject(params, async (err, data) => {
		// Delete previous version
		if (req.user.photo.includes("versiondId")) {
			// Extract old versionId
			const oldVersion = req.user.photo.split("versionId=")[1];

			params = {
				...params,
				VersionId: oldVersion,
			};
		}
		await s3.deleteObject(params, err);

		// Send new photo link
		res.status(200).json({
			key: `${key}?versionId=${data.VersionId}`,
		});
	});
});
