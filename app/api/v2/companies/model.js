const mongoose = require('mongoose');

const companiesSchema = new mongoose.Schema(
	{
		companyName: {
			type: String,
			required: [true, 'Company must be filled'],
		},
		email: {
			type: String,
			unique: true,
		},
		password: {
			type: String,
			required: [true, 'Password is required'],
			minlength: 6,
		},
		mottoCompany: {
			type: String,
		},
		about: {
			type: String,
		},
		logo: {
			type: String,
		},
		birthday: {
			type: String,
		},
		// contact: {
		// 	type: mongoose.Types.ObjectId,
		// 	ref: 'Contact',
		// },
		phone: {
			type: String,
		},
		address: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Address',
		},
		terms: {
			type: String,
		},
		policy: {
			type: String,
		},
		status: {
			type: String,
			enum: ['active', 'not active'],
			default: 'not active',
		},
		speedtest: {
			type: String,
		},
		watermark: {
			type: String,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Company', companiesSchema);
