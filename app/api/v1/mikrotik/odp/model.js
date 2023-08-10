const mongoose = require('mongoose');

const odpSchema = new mongoose.Schema({
	odcCode: {
		type: mongoose.Types.ObjectId,
		ref: 'ODC',
		required: [true, 'Please provide the ODC code'],
	},
	odpCode: {
		type: String,
		unique: true,
    required: [true, 'Please provide the ODP code'],
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
		type: String,
	},
}, { timestamps: true }
);

module.exports = mongoose.model('ODP', odpSchema);
