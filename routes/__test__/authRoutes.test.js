const request = require("supertest");
const app = require("../../app");
const Users = require("../../models/Users");
const signUser = require("../../test/setup").signUser;
const Email = require("../../utils/email");

test("should login user", async () => {
	await signUser("user");
});

test("should check user is logged in", async () => {
	const { cookie } = await signUser("user");

	await request(app)
		.get("/api/auth/checkUser")
		.set("Cookie", cookie)
		.send()
		.expect(200);
});

test("should logout user", async () => {
	const { cookie } = await signUser("user");

	await request(app)
		.get("/api/auth/logout")
		.set("Cookie", cookie)
		.send()
		.expect(200);
});

test("should able to request forgot password, send reset token to email, and reset password", async () => {
	const {
		user: { email },
	} = await signUser("user");

	// Request password reset
	await request(app)
		.post("/api/auth/forgotPassword")
		.send({ email })
		.expect(200);

	// Should generate a hashed password reset token and expires less than 10 minutes
	const user = await Users.findOne({ email });
	expect(user.passwordResetToken).toBeDefined();
	expect(user.passwordResetExpires - Date.now()).toBeLessThanOrEqual(
		10 * 60 * 1000
	);

	// Should send a reset password email
	expect(Email).toHaveBeenCalledTimes(1); //one for registering user
	expect(Email.mock.instances[0].sendPasswordReset).toHaveBeenCalledTimes(1);

	// Request password reset
	const resetURL = Email.mock.instances[0].constructor.mock.calls[0][1];
	const resetToken = resetURL.replace("undefined/reset/", "");

	const newPassword = "cake123";
	await request(app)
		.patch(`/api/auth/resetPassword/${resetToken}`)
		.send({ password: newPassword })
		.expect(200);

	// Test login
	await request(app)
		.post("/api/auth/login")
		.send({ email, password: newPassword })
		.expect(200);
});
