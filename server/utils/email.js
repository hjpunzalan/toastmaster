const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
	constructor(user, url) {
		this.to = user.email;
		this.firstName = user.firstName;
		this.url = url;
		this.password = user.password;
		this.from = `Southern River Toastmaster <${process.env.EMAIL_FROM}>`;
	}

	newTransport() {
		if (process.env.NODE_ENV === 'production') {
			// Sendgrid
			return;
		}
		return nodemailer.createTransport({
			host: process.env.EMAIL_HOST,
			port: process.env.EMAIL_PORT,
			auth: {
				user: process.env.EMAIL_USERNAME,
				pass: process.env.EMAIL_PASSWORD
			}
		});
	}

	async send(template, subject, props) {
		//Template is an html template to be sent
		// Send the actual email
		// 1) Render HTML using pug
		const html = pug.renderFile(`${__dirname}/templates/${template}.pug`, {
			firstName: this.firstName,
			url: this.url,
			subject,
			...props
		});

		// 3) Define mail options
		const mailOptions = {
			from: this.from,
			to: this.to,
			subject,
			html,
			text: htmlToText.fromString(html)
		};

		// 3) create a transport and send email
		await this.newTransport().sendMail(mailOptions);
	}

	async sendWelcome() {
		const props = { password: this.password };
		await this.send(
			'welcome',
			'Welcome to Southern River Toastmasters!',
			props
		);
	}

	async sendPasswordReset() {
		await this.send(
			'passwordReset',
			'Forgotten password reset link (valid for only 10 minutes)'
		);
	}
};
