const request = require("supertest");
const app = require("../../app");
const signUser = require("../../test/setup").signUser;

test("should get all announcements as user", async () => {
	const { cookie } = await signUser("user");

	// Get all announcements
	await request(app)
		.get("/api/announcements/")
		.set("Cookie", cookie)
		.send()
		.expect(200);
});
