const mongoose = require('mongoose');

const accountingSchema = new mongoose.Schema({
	type: {
		type: String,
		enum: ['income', 'expense'],
		required: true,
	},
  billId: {
    type: String,
    index: true,
    required: true,
  },
	amount: {
		type: Number,
		required: true,
	},
	date: {
		type: Date,
		required: true,
	},
	description: {
		type: String,
	},
	totalIncome: {
		type: Number,
	},
	totalExpenditure: {
		type: Number,
	},
	totalSales: {
		type: String,
	},
	expenseList: {
		type: String,
	},
	company: {
		type: mongoose.Types.ObjectId,
		ref: 'Company',
		required: true,
	},
  tax: {
    type: Number,
  },
  otherCosts: {
    type: Number,
  },
	dateFrom: {
	type: Date,
	},
	dateTo: {
	type: Date,
	},
}, { timestamps: true }
);

module.exports = mongoose.model('Accounting', accountingSchema);
