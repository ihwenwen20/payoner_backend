const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema(
	{
		type: {
			type: String,
			required: true,
			minlength: 3,
			maxlength: 50,
		},
		status: {
			type: String,
			enum: ['Paid', 'Unpaid', 'Confirmed', 'Pending'],
			default: 'Paid'
		},
		image: {
			type: mongoose.Types.ObjectId,
			ref: 'Image',
			required: true,
		},
		banks: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Bank'
		}],
		company: {
			type: mongoose.Types.ObjectId,
			ref: 'Company',
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Payment', PaymentSchema);
