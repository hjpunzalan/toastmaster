const request = require("supertest");
const app = require("../../app");
const Users = require("../../models/Users");
const signUser = require("../../test/setup").signUser;
const Email = require("../../utils/email");

test("should create and get all posts with page and limit query", async () => {
	const { cookie } = await signUser("user");

	// Create two posts
	await request(app)
		.post("/api/posts/")
		.set("Cookie", cookie)
		.send({
			title: "test",
			plainText: "test",
			contentState: {},
		})
		.expect(201);

	await request(app)
		.post("/api/posts/")
		.set("Cookie", cookie)
		.send({
			title: "test2",
			plainText: "test2",
			contentState: {},
		})
		.expect(201);

	// Send query for 1 post limit only
	const {
		body: { results },
	} = await request(app)
		.get(`/api/posts?page=1&limit=1&sort=-lastComment,-date`)
		.set("Cookie", cookie)
		.send()
		.expect(200);

	expect(results).toEqual(1);
});
