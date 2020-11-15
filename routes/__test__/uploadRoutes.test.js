const request = require("supertest");
const app = require("../../app");
const signUser = require("../../test/setup").signUser;

test("request to upload photo should return s3 bucket key and signed url", async () => {
	const { cookie } = await signUser("user");

	await request(app)
		.post("/api/upload/")
		.set("Cookie", cookie)
		.send({ type: "image/jpeg" })
		.expect(200);
});
