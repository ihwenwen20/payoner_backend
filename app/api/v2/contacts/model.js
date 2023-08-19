const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	phone: {
		type: String,
		unique: true,
	},
	blockir: {
		type: Boolean,
		default: false,
		required: true
	},
	address: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Address',
	},
});

module.exports = mongoose.model('Contact', contactSchema);
