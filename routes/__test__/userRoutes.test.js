const request = require("supertest");
const app = require("../../app");
const Users = require("../../models/Users");
const signAdmin = require("../../test/setup").signAdmin;
const Email = require("../../utils/email");

describe("With admin rights", () => {
	test("should create new account and send email as admin", async () => {
		const cookie = await signAdmin();
		const email = "user@test.com";

		await request(app)
			.post("/api/users/register")
			.set("Cookie", cookie)
			.send({
				firstName: "user",
				lastName: "test",
				email,
			})
			.expect(201);

		const user = await Users.findOne({ email });

		expect(user.email).toEqual(email);
		expect(Email).toHaveBeenCalledTimes(1);
		expect(Email.mock.instances[0].sendWelcome).toHaveBeenCalledTimes(1);
	});

	test("Fail when registering user not as admin", async () => {
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
		const cookie = await signAdmin();
		const email = "user@test.com";

		await request(app)
			.post("/api/users/register")
			.set("Cookie", cookie)
			.send({
				firstName: "user",
				lastName: "test",
				email,
			})
			.expect(201);
		const response = await request(app)
			.get("/api/users/")
			.set("Cookie", cookie)
			.send({})
			.expect(200);

		expect(response.body.length).toEqual(2);
	});

	test("update user password with a length equal or greater than 6", async () => {
		const cookie = await signAdmin();

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
		const cookie = await signAdmin();

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
		const cookie = await signAdmin();

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

	test("Promote user as committee and demote back to normal", async () => {
		const cookie = await signAdmin();
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
});
