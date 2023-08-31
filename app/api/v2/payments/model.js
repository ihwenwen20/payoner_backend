const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema(
	{
		method: {
			type: String,
			enum: ['Cash', 'Transfer', 'Payment Gateway'],
			required: true,
		},
		status: {
			type: String,
			// enum: ['Paid', 'Unpaid', 'Confirmed', 'Pending'],
			enum: ['Active', 'Inactive'],
			default: 'Inactive'
		},
		image: {
			type: mongoose.Types.ObjectId,
			ref: 'Image',
			required: true,
		},
		bankId: [{
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
