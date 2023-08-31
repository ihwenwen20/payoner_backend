const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
	amount: {
		type: Number,
		// required: true,
	},
	tax: {
		type: Number,
	},
	otherCosts: {
		type: Number,
	},
	date: {
		type: Date,
		default: new Date(Date.now() + (-1 * new Date().getTimezoneOffset() * 60000)).toISOString(),
		required: true,
	},
	description: {
		type: String,
	},
	totalExpenditure: {
		type: Number,
		default: 0,
	},
	totalProfit: {
		type: Number,
		default: 0,
	},
	dateFrom: {
		type: Date,
	},
	dateTo: {
		type: Date,
	},
	company: {
		type: mongoose.Types.ObjectId,
		ref: 'Company',
	},
	owner: {
		type: mongoose.Types.ObjectId,
		ref: 'User',
	},
});

module.exports = mongoose.model("Expense", expenseSchema);
