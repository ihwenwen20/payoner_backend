const mongoose = require('mongoose');

const odcSchema = new mongoose.Schema({
	odcCode: {
		type: Number,
	},
	oltPortNumber: {
		type: Number,
		maxLength: 20,
	},
	totalPort: {
		type: Number,
		maxLength: 20,
	},
	tubeFoColor: {
		type: String,
	},
	poleNumber: {
		type: String,
	},
	photo: {
		type: String,
		required: [true, 'Please include documentary evidence'],
	},
	description: {
		type: String,
	},
	publisher: {
		type: mongoose.Types.ObjectId,
		ref: 'Employee',
		required: true,
	},
	coverage: {
		type: mongoose.Types.ObjectId,
		ref: 'Coverage',
		required: true,
	},
}, { timestamps: true }
);

module.exports = mongoose.model('ODC', odcSchema);
