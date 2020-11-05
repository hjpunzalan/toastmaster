const request = require("supertest");
const app = require("../../app");
const Users = require("../../models/Users");
const signUser = require("../../test/setup").signUser;
const Email = require("../../utils/email");
const Posts = require("../../models/Posts");

test("should create and get all posts with page and limit query", async () => {
	const { cookie } = await signUser("user");

	// Create two posts
	await request(app)
		.post("/api/posts/")
		.set("Cookie", cookie)
		.send({
			title: "test",
			plainText: "test",
			contentState: { test: "add post" },
		})
		.expect(201);

	await request(app)
		.post("/api/posts/")
		.set("Cookie", cookie)
		.send({
			title: "test2",
			plainText: "test2",
			contentState: { test: "add post" },
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
			contentState: { test: "add post" },
		})
		.expect(201);

	await request(app)
		.post("/api/posts/")
		.set("Cookie", cookie)
		.send({
			title: "test2",
			plainText: "candy",
			contentState: { test: "add post" },
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

test("should get post by params postid", async () => {
	const { cookie } = await signUser("user");

	// Create post
	const {
		body: { _id },
	} = await request(app)
		.post("/api/posts/")
		.set("Cookie", cookie)
		.send({
			title: "test",
			plainText: "test",
			contentState: { test: "add post" },
		})
		.expect(201);

	// Get post
	const { body } = await request(app)
		.get(`/api/posts/${_id}`)
		.set("Cookie", cookie)
		.send()
		.expect(200);

	expect(body._id).toEqual(_id);
});

test("should be able to edit post title,text,contentState", async () => {
	const { cookie } = await signUser("user");

	// Create post
	const {
		body: { _id, title, plainText, contentState },
	} = await request(app)
		.post("/api/posts/")
		.set("Cookie", cookie)
		.send({
			title: "test",
			plainText: "test",
			contentState: {},
		})
		.expect(201);

	// Edit post
	const { body } = await request(app)
		.patch(`/api/posts/${_id}`)
		.set("Cookie", cookie)
		.send({
			title: "hello",
			plainText: "it works",
			contentState: { test: "2" },
		})
		.expect(200);

	expect(body._id).toEqual(_id);
	expect(body.title).not.toEqual(title);
	expect(body.plainText).not.toEqual(plainText);
	expect(body.contentState).not.toEqual(contentState);
});

test("should be able to delete post", async () => {
	const { cookie } = await signUser("user");

	// Create post
	const {
		body: { _id, title, plainText, contentState },
	} = await request(app)
		.post("/api/posts/")
		.set("Cookie", cookie)
		.send({
			title: "test",
			plainText: "test",
			contentState: { test: "add post" },
		})
		.expect(201);

	// delete post
	await request(app)
		.delete(`/api/posts/${_id}`)
		.set("Cookie", cookie)
		.send()
		.expect(204);

	const posts = await Posts.find({});
	expect(posts.length).toEqual(0);
});

test("should be able to comment on post", async () => {
	const { cookie } = await signUser("user");

	// Create post
	const {
		body: { _id, comments },
	} = await request(app)
		.post("/api/posts/")
		.set("Cookie", cookie)
		.send({
			title: "test",
			plainText: "test",
			contentState: { test: "add post" },
		})
		.expect(201);

	// add comment to post
	const { body } = await request(app)
		.post(`/api/posts/${_id}`)
		.set("Cookie", cookie)
		.send({ contentState: { test: "add comment" } })
		.expect(200);

	expect(body.length).toBeGreaterThan(comments.length);
});
