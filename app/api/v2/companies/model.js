const mongoose = require('mongoose');

const companiesSchema = new mongoose.Schema(
	{
		companyName: {
			type: String,
			trim: true,
			required: true,
		},
		email: {
			type: String,
			trim: true,
			unique: true,
		},
		password: {
			type: String,
			trim: true,
			minlength: 6,
			required: true,
		},
		mottoCompany: {
			type: String,
			trim: true,
		},
		about: {
			type: String,
			trim: true,
		},
		logo: {
			type: mongoose.Types.ObjectId,
			ref: 'Image',
		},
		birthday: {
			type: String,
			trim: true,
		},
		contact: {
			type: mongoose.Types.ObjectId,
			ref: 'Contact',
		},
		terms: {
			type: String,
		},
		policy: {
			type: String,
		},
		status: {
			type: String,
			enum: ['Active', 'Inactive', 'Pending', 'Suspend'],
			default: 'Inactive',
			required: true
		},
		speedtest: {
			type: String,
		},
		watermark: {
			type: String,
		},
		owner:{
			type: mongoose.Types.ObjectId,
			ref: 'User',
			required: true
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Company', companiesSchema);
