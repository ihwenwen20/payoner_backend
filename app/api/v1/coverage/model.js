const mongoose = require('mongoose');

const coverageSchema = new mongoose.Schema(
	{
		areaName: {
			type: String,
			required: [true, 'Area Name must be filled in'],
		},
		address: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Address',
		},
		description: {
			type: String,
		},
		status: {
			type: String,
			enum: ['active', 'not active'],
			default: 'not active',
		},
		radius: {
			type: Number,
		},
		codeArea: {
			type: String,
			unique: true,
			required: [true, 'Area Code must be filled in'],
		},
		publisher: {
			type: String,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Coverage', coverageSchema);
