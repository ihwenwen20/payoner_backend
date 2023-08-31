const mongoose = require('mongoose');

const accountingSchema = new mongoose.Schema({
	type: {
		type: String,
		enum: ['Income', 'Expense'],
		required: true,
	},
	billId: {
		type: String,
		// index: true,
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
		default: 0,
	},
	totalExpenditure: {
		type: Number,
		default: 0,
	},
	totalProfit: {
		type: Number,
		default: 0,
	},
	totalSales: {
		type: Number,
		default: 0,
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
