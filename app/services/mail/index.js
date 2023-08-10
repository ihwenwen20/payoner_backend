const nodemailer = require('nodemailer');
const {gmail, password, emailHost, emailPort, emailCustom,emailPassword} = require('../../config');
const Mustache = require('mustache');
const fs = require('fs');

// via email custom
const transporter = nodemailer.createTransport({
	host: emailHost,
	port: emailPort,
	secure: false, // true for 465, false for other ports
	auth: {
		user: emailCustom,
		pass: emailPassword,
	},
});

// via smtp gmail
// const transporter = nodemailer.createTransport({
// 	host: 'smtp.gmail.com',
// 	port: 587,
// 	secure: false, // true for 465, false for other ports
// 	auth: {
// 		user: gmail,
// 		pass: password,
// 	},
// });

const otpMail = async (email, data) => {
	try {
		let template = fs.readFileSync('app/views/email/otp.html', 'utf8');

		let message = {
			from: emailCustom,
			to: email,
			subject: 'Otp for registration is: ',
			html: Mustache.render(template, data),
		};

		return await transporter.sendMail(message);
	} catch (ex) {
		console.log(ex);
	}
};

// SEND Invoices
const orderMail = async (email, data) => {
	try {
		let template = fs.readFileSync('app/views/email/invoice.html', 'utf8');

		let message = {
			from: gmail,
			to: email,
			subject: 'Your Invoices Order is: ',
			html: Mustache.render(template, data),
		};

		return await transporter.sendMail(message);
	} catch (ex) {
		console.log(ex);
	}
};

module.exports = {otpMail};
