const Users = require("../models/Users");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const checkBody = require("../utils/checkBody");
const QueryHandling = require("../utils/queryHandling");
const Email = require("../utils/email");

exports.createUser = catchAsync(async (req, res, next) => {
	const { firstName, lastName, email, password, role } = req.body;
	const user = await Users.create({
		firstName,
		lastName,
		email,
		password,
		role,
	});

	user.password = undefined;
	res.status(201).json(user);
});

exports.register = catchAsync(async (req, res, next) => {
	const { firstName, lastName, email, url } = req.body;
	const newUser = await new Users({
		firstName,
		lastName,
		email,
	});
	// If new user is destructured instead, 
	//  test will fail and only read newUser after saved.
	await new Email({
		firstName: newUser.firstName,
		lastName: newUser.lastName,
		email: newUser.email,
		password: newUser.password
	}, url).sendWelcome();
	await newUser.save();

	// remove password from json output;
	newUser.password = undefined;

	// need to send an email with default password of user
	// password must only be seen by the user and not the admin that registered user
	res.status(201).json(newUser);
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
	const query = Users.find();
	const features = new QueryHandling(query, req.query).sort().filter();
	const users = await features.query;
	res.status(200).json(users);
});

exports.updateMe = catchAsync(async (req, res, next) => {
	// Update user document
	const filterBody = checkBody(req.body, next, [
		"firstName",
		"lastName",
		"email",
		"photo",
	]);
	const user = await Users.findByIdAndUpdate(req.user.id, filterBody, {
		new: true,
		runValidators: true,
	});
	res.status(200).json(user);
});

exports.deleteUser = catchAsync(async (req, res, next) => {
	const user = await Users.findById(req.params.id);
	user.active = false;
	await user.save();
	res.status(200).json(user);
});

exports.reActivateUser = catchAsync(async (req, res, next) => {
	const user = await Users.findById(req.params.id);
	user.active = true;
	await user.save();
	res.status(200).json(user);
});

exports.makeComittee = catchAsync(async (req, res, next) => {
	const user = await Users.findById(req.params.id);
	user.role = "committee";
	await user.save();
	res.status(200).json(user);
});
exports.removeCommittee = catchAsync(async (req, res, next) => {
	const user = await Users.findById(req.params.id);
	user.role = "user";
	await user.save();
	res.status(200).json(user);
});
