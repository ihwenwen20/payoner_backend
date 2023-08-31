import { MailtrapClient, MailtrapTransport } from "mailtrap"
const Mustache = require('mustache');
const fs = require('fs');
// import { readFileSync } from "fs";


const TOKEN = process.env.Token;
const SENDER_EMAIL = process.env.Account_Owner_Email;
const RECIPIENT_EMAIL = process.env.Account_Owner_Email;

const transporter = nodemailer.createTransport(MailtrapTransport, {
	// host: 'smtp.mailtrap.io',
  // port: 587,
  // auth: {
  //   user: 'your-mailtrap-username',
  //   pass: 'your-mailtrap-password',
  // },
	// secure: false, // true for 465, false for other ports
	token: TOKEN
});


const otpMailtrap = async (email, data) => {
	try {
		let template = fs.readFileSync('app/views/email/otp.html', 'utf8');

		let message = {
			text: "Testing Mailtrap Sending!",
			to: {
				address: RECIPIENT_EMAIL,
				name: "John Doe"
			},
			from: {
				address: SENDER_EMAIL,
				name: "Mailtrap Test"
			},
			subject: 'OTP For Registration is: ',
			html: Mustache.render(template, data),
		};

		return await transporter.sendMail(message);
	} catch (ex) {
		console.log(ex);
	}
};

module.exports = { otpMailtrap };