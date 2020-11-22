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

test("should create announcement as committee and, send error without title or context", async () => {
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

test("should fail with invalid fields when creating or updating announcement", async () => {
	const { cookie } = await signUser("committee");

	const invalidMongooseFields = await request(app)
		.post("/api/announcements/")
		.set("Cookie", cookie)
		.send({
			test: "test",
			test: "test",
			test: { test: "add post" },
		})
		.expect(400);

	expect(
		invalidMongooseFields.body.message.includes(
			"title",
			"contentState",
			"plainText"
		)
	).toEqual(true);

	// Create announcement
	const {
		body: { _id },
	} = await request(app)
		.post("/api/announcements/")
		.set("Cookie", cookie)
		.send({
			title: "test",
			plainText: "test",
			contentState: {},
		})
		.expect(201);

	// Edit announcements
	const invalidReqFields = await request(app)
		.patch(`/api/announcements/${_id}`)
		.set("Cookie", cookie)
		.send({
			title: "hello",
			test: "it works",
			contentState: { test: "2" },
		})
		.expect(400);
	console.log(invalidReqFields.body.message);
	expect(invalidReqFields.body.message.includes("Invalid request")).toEqual(
		true
	);
});

test("should get,patch and delete announcement by id,", async () => {
	const committee = await signUser("committee");

	const {
		body: { _id },
	} = await request(app)
		.post("/api/announcements/")
		.set("Cookie", committee.cookie)
		.send({
			title: "test",
			contentState: { test: "add announcement" },
			plainText: "test",
		})
		.expect(201);

	// Get announcement by id
	await request(app)
		.get(`/api/announcements/${_id}`)
		.set("Cookie", committee.cookie)
		.send()
		.expect(200);

	// Patch announcement by id
	await request(app)
		.patch(`/api/announcements/${_id}`)
		.set("Cookie", committee.cookie)
		.send({
			title: "test2",
			contentState: { test: "test3" },
			plainText: "test4",
		})
		.expect(200);

	// delete announcement by id
	await request(app)
		.delete(`/api/announcements/${_id}`)
		.set("Cookie", committee.cookie)
		.send()
		.expect(204);
});
