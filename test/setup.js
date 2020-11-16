const MongoMemoryServer = require("mongodb-memory-server").MongoMemoryServer;
const request = require("supertest");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("../app");

let mongo;

// Automatic mocking
// Mock email class and all methods
jest.mock("../utils/email");

// Mock connect to S3 class
jest.mock("../utils/connectToS3");

beforeAll(async () => {
	process.env.JWT_SECRET = "asdsa";
	process.env.JWT_EXPIRATION = 9999999;
	mongo = new MongoMemoryServer();
	const mongoUri = await mongo.getUri();

	await mongoose.connect(mongoUri, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: true,
	});

	// Connect config
	dotenv.config({ path: "./config.env" });
});

beforeEach(async () => {
	// Reset mock function calls before each test
	jest.clearAllMocks();

	const collections = await mongoose.connection.db.collections();

	for (let collection of collections) {
		await collection.deleteMany({});
	}
});

afterAll(async () => {
	await mongoose.connection.close();
	await mongo.stop();
});

exports.signUser = async (role) => {
	// Create user
	await request(app)
		.post("/api/test/createuser")
		.send({
			firstName: "test",
			lastName: "test",
			role,
			email: "test@test.com",
			password: "test123",
		})
		.expect(201);
	// Login
	const response = await request(app)
		.post("/api/auth/login")
		.send({
			email: "test@test.com",
			password: "test123",
		})
		.expect(200);

	const cookie = response.get("Set-Cookie");
	return { cookie, user: response.body };
};
