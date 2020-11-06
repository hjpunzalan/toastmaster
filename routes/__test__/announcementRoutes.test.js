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

test("should FAIL to create announcement as user", async () => {
	const user = await signUser("user");

	// create announcement as user
	await request(app)
		.post("/api/announcements/")
		.set("Cookie", user.cookie)
		.send({
			title: "test",
			contentState: { test: "test" },
			plainText: "test",
		})
		.expect(403);
});

test("should create announcement as committee", async () => {
	// create announcement as admin
	const committee = await signUser("committee");

	await request(app)
		.post("/api/announcements/")
		.set("Cookie", committee.cookie)
		.send({
			title: "test",
			contentState: { test: "add announcement" },
			plainText: "test",
		})
		.expect(201);
});
