module.export = class Email {
	constructor(user, url) {
		this.url = url;
		this.user = user;
	}

	async sendWelcome() {
		jest.fn().mockImplementation();
	}
};
