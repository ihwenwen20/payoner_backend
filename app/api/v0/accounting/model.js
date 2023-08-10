const mongoose = require('mongoose');

const accountingSchema = new mongoose.Schema({
	totalIncome: {
		type: Number,
	},
	totalExpenditure: {
		type: Number,
	},
	sales: {
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
}, { timestamps: true }
);

module.exports = mongoose.model('Accounting', accountingSchema);
