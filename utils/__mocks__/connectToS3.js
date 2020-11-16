module.exports = () => {
	return {
		getSignedUrl: jest
			.fn()
			.mockImplementation((operation, params, callback) => {
				const err = "error";
				const url = "test";
				callback(err, url);
			}),
		deleteObject: jest.fn().mockImplementation((params, callback) => {
			callback();
		}),
	};
};
