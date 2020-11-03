const request = require("supertest");
const app = require("../../app");
const Users = require("../../models/Users");
const signUser = require("../../test/setup").signUser;
const Email = require("../../utils/email");

test("should create new account and send email as committee", async () => {
	const { cookie } = await signUser("committee");

	const {
		body: { _id },
	} = await request(app)
		.post("/api/users/register")
		.set("Cookie", cookie)
		.send({
			firstName: "user",
			lastName: "user",
			email: "user@test.com",
		})
		.expect(201);

	const user = await Users.findById(_id);

	expect(user.id).toEqual(_id);
	expect(Email).toHaveBeenCalledTimes(1);
	expect(Email.mock.instances[0].sendWelcome).toHaveBeenCalledTimes(1);
});

test("Fail when registering user not logged in", async () => {
	await request(app)
		.post("/api/users/register")
		.send({
			firstName: "user",
			lastName: "test",
			email: "test@test.com",
		})
		.expect(401);
});

test("Get all users", async () => {
	const { cookie } = await signUser("user");
	const response = await request(app)
		.get("/api/users/")
		.set("Cookie", cookie)
		.send({})
		.expect(200);

	expect(response.body.length).toEqual(1);
});

test("update user password with a length equal or greater than 6", async () => {
	const { cookie } = await signUser("user");

	await request(app)
		.post("/api/users/updatePassword")
		.set("Cookie", cookie)
		.send({
			password: "test123",
			newPassword: "test2",
		})
		.expect(500);

	await request(app)
		.post("/api/users/updatePassword")
		.set("Cookie", cookie)
		.send({
			password: "test123",
			newPassword: "test666",
		})
		.expect(200);
});

test("update user details failing if invalid fields", async () => {
	const { cookie } = await signUser("user");

	await request(app)
		.patch("/api/users/updateMe")
		.set("Cookie", cookie)
		.send({
			firstName: "jona",
			lastName: "testinggg",
			email: "rip@riptest.com",
		})
		.expect(200);

	await request(app)
		.patch("/api/users/updateMe")
		.set("Cookie", cookie)
		.send({
			firstName: "jona",
			lastName: "testinggg",
			start: "rip@riptest.com",
		})
		.expect(400);
});

test("Admin able to deactivate and reactivate user", async () => {
	const { cookie } = await signUser("admin");

	// Create user
	const {
		body: { _id },
	} = await request(app)
		.post("/api/users/register")
		.set("Cookie", cookie)
		.send({
			firstName: "user",
			lastName: "user",
			email: "user@test.com",
		})
		.expect(201);

	// Deactivate user
	await request(app)
		.patch(`/api/users/deActivateUser/${_id}`)
		.set("Cookie", cookie)
		.send()
		.expect(200);

	// Reactivate user
	await request(app)
		.patch(`/api/users/activateUser/${_id}`)
		.set("Cookie", cookie)
		.send()
		.expect(200);
});

test("Promote user to committee and demote back to normal", async () => {
	const { cookie } = await signUser("admin");
	// Create user
	const {
		body: { _id },
	} = await request(app)
		.post("/api/users/register")
		.set("Cookie", cookie)
		.send({
			firstName: "user",
			lastName: "test",
			email: "user@test.com",
		})
		.expect(201);

	await request(app)
		.patch(`/api/users/makeCommittee/${_id}`)
		.set("Cookie", cookie)
		.send()
		.expect(200);

	await request(app)
		.patch(`/api/users/removeCommittee/${_id}`)
		.set("Cookie", cookie)
		.send()
		.expect(200);
});
