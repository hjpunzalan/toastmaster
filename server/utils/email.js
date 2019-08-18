const nodemailer = require('nodemailer');

const sendEmail = async options => {
	// 1) Create a transporter (ex. gmail)
	const transporter = nodemailer.createTransport({
		host: process.env.EMAIL_HOST,
		port: process.env.EMAIL_PORT,
		auth: {
			user: process.env.EMAIL_USERNAME,
			pass: process.env.EMAIL_PASSWORD
		}

		// Activate in gmail "less secure app" option
	});

	// 2) Define the email options
	const mailOptions = {
		from: 'Southern River Toas <hj.punzalan@hotmail.com>',
		to: options.email, // argument of the function
		subject: options.subject,
		text: options.message
		// html:
	};

	// 3) Actually send the email with nodemailer
	await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
