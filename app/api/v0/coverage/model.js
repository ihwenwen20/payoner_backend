const mongoose = require('mongoose');

const coverageSchema = new mongoose.Schema(
	{
		areaName: {
			type: String,
			required: [true, 'the Name Area must be filled in'],
		},
		address: {
			type: String,
			required: [true, 'the address area must be filled in'],
		},
		description: {
			type: String,
			required: [true, 'the description area must be filled in'],
		},
		status: {
			type: String,
			enum: ['active', 'not active'],
			default: 'not active',
		},
		latitude: {
			type: String,
		},
		longitude: {
			type: String,
		},
		radius: {
			type: Number,
		},
		codeArea: {
			type: Number,
		},
		publisher: {
			type: String,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Coverage', coverageSchema);
