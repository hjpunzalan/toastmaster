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
		body: { results, numPosts },
	} = await request(app)
		.get(`/api/posts?page=1&limit=1&sort=-lastComment,-date`)
		.set("Cookie", cookie)
		.send()
		.expect(200);

	expect(results).toEqual(1);
	expect(numPosts).toEqual(2);
});

test("should be able to search post by title or plainText with pagination query", async () => {
	const { cookie } = await signUser("user");

	// Create two posts
	await request(app)
		.post("/api/posts/")
		.set("Cookie", cookie)
		.send({
			title: "candy",
			plainText: "test",
			contentState: {},
		})
		.expect(201);

	await request(app)
		.post("/api/posts/")
		.set("Cookie", cookie)
		.send({
			title: "test2",
			plainText: "candy",
			contentState: {},
		})
		.expect(201);

	// Send query for 1 post limit only
	const {
		body: { posts, numPosts },
	} = await request(app)
		.post(`/api/posts/search/text?page=1&limit=1&sort=-lastComment,-date`)
		.set("Cookie", cookie)
		.send({
			text: "test",
		})
		.expect(200);

	expect(posts.length).toEqual(1);
	expect(numPosts).toEqual(2);
});
