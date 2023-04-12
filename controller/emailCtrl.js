const nodemailer = require('nodemailer');
const asyncHandler = require('express-async-handler');

const sendEmail = asyncHandler(async (data, req, res) => {
	let transporter = nodemailer.createTransport({
		host: 'smtp.gmail.com',
		port: 465,
		secure: true, // true for 465, false for other ports
		auth: {
			user: process.env.EMAIL_ID,
			pass: process.env.EMAIL_PASSWORD,
		},
	});

	// send mail with defined transport object
	let info = await transporter.sendMail({
		from: '"Laundry_App 👻" <abc@gmail.com>', // sender address
		to: data.to, // list of receivers
		subject: data.subject, // Subject line
		text: data.text, // plain text body
		html: data.html, // html body
	});

	console.log('Message sent: %s', info.messageId);
	
});

module.exports = sendEmail;
