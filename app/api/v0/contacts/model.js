const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
	{
		avatar: {
			type: String,
		},
		phone: {
			type: String,
		},
		email: {
			type: String,
		},
		gender: {
			type: String,
			enum: ['Male', 'Female'],
		},
		address: {
			type: String,
		},
	},
	{ timestamps: true }
);
module.exports = mongoose.model('Contact', contactSchema);