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
});
