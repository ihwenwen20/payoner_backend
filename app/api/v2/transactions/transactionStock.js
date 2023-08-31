const mongoose = require('mongoose');

const StockProductSchema = mongoose.Schema({
	product: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Product',
		required: true,
	},
	amount: {
		type: Number,
		required: true,
	},
});

const StockTransactionSchema = mongoose.Schema(
	{
		products: [StockProductSchema],
		status: {
			type: String,
			enum: ['Success', 'Failed', 'Pending', 'Cancelled'],
			default: 'Pending',
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('StockTransaction', StockTransactionSchema);
