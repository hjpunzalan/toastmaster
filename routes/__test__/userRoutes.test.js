const request = require("supertest");
const app = require("../../app");
const Users = require("../../models/Users");
const signAdmin = require("../../test/setup").signAdmin;
const Email = require("../../utils/email");

test("should create new account and send email", async () => {
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
