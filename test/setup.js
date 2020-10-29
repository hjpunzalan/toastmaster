const MongoMemoryServer = require("mongodb-memory-server").MongoMemoryServer;
const request = require("supertest");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

let mongo;

beforeAll(async () => {
	mongo = new MongoMemoryServer();
	const mongoUri = await mongo.getUri();

	await mongoose.connect(mongoUri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});

	// Connect config
	dotenv.config({ path: "./config.env" });
});

beforeEach(async () => {
	const collections = await mongoose.connection.db.collections();

	for (let collection of collections) {
		await collection.deleteMany({});
	}
});

afterAll(async () => {
	await mongoose.connection.close();
	await mongo.stop();
});
