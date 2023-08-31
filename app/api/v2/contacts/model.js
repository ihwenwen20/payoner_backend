const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
	name: {
		type: String,
		// required: true,
	},
	email: {
		type: String,
		// required: true,
	},
	phone: {
		type: Number,
		// unique: true,
		required: true,
	},
	blockir: {
		type: Boolean,
		default: false,
		required: true
	},
	addressId: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Address',
		required: true
	}],
});

module.exports = mongoose.model('Contact', contactSchema);
