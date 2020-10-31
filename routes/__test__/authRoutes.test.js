const request = require("supertest");
const app = require("../../app");
const Users = require("../../models/Users");

jest.mock("../../utils/email");

const signup = async () => {
	const response = await request(app)
		.post("/api/users/register")
		.send({
			firstName: "test",
			lastName: "test2",
			email: "test@test.com",
		})
		.expect(201);

	return response.body;
};

test("should create new account ", async () => {
	const user = await signup();
	const foundUsers = await Users.find({});

	expect(foundUsers.length).toEqual(1);
	expect(foundUsers[0].id).toEqual(user._id);
});
