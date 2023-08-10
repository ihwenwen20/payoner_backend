const mongoose = require('mongoose');

const companiesSchema = new mongoose.Schema(
	{
		company: {
			type: String,
			required: [ true, 'Company must be filled' ],
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
		phone: {
			type: String,
		},
		email: {
			type: String,
		},
		address: {
			type: String,
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
	{timestamps: true}
);

module.exports = mongoose.model('Company', companiesSchema);
