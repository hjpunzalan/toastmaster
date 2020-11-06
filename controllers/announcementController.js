const Announcements = require("../models/Announcements");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const QueryHandling = require("../utils/queryHandling");
const checkBody = require("../utils/checkBody");

exports.createAnnouncement = catchAsync(async (req, res, next) => {
	// User (restricted), Title, contentstate
	const announcement = new Announcements({
		user: req.user.id,
		title: req.body.title,
		contentState: req.body.contentState,
		plainText: req.body.plainText,
	});

	await announcement.save();

	res.status(201).json(announcement);
});

exports.getAllAnnouncements = catchAsync(async (req, res, next) => {
	const query = Announcements.find();
	const features = new QueryHandling(query, req.query).sort().paginate();
	const announcements = await features.query;
	res.status(200).json(announcements);
});

exports.getAnnouncement = catchAsync(async (req, res, next) => {
	const announcement = await Announcements.findById(req.params.id);
	if (!announcement) {
		return next(new AppError("No announcement found by id.", 404));
	}
	res.status(200).json(announcement);
});

exports.deleteAnnouncement = catchAsync(async (req, res, next) => {
	const announcement = await Announcements.findByIdAndRemove(req.params.id);
	if (!announcement) {
		return next(new AppError("No announcement found by id.", 404));
	}
	res.status(204).json(announcement);
});

exports.updateAnnouncement = catchAsync(async (req, res, next) => {
	const filterBody = checkBody(req.body, next, [
		"title",
		"contentState",
		"plainText",
	]);
	const announcement = await Announcements.findByIdAndUpdate(
		req.params.id,
		filterBody,
		{ new: true, runValidators: true } //without new, it will not return the new updated document
	);
	if (!announcement) {
		return next(new AppError("No announcement found by id.", 404));
	}
	res.status(200).json(announcement);
});
