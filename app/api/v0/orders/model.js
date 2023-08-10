const mongoose = require('mongoose');

const singleOrderItemSchema = new mongoose.Schema({
	productCategories: {
		type: {
			type: String,
			required: [true, 'Product must be filled and cannot be empty'],
		},
		price: {
			type: Number,
			default: 0,
		},
	},
	productQuantity: {
		type: Number,
		required: true,
	},
});

const orderSchema = new mongoose.Schema(
	{
		date: {
			type: Date,
			required: true,
		},
		personalDetail: {
			name: {
				type: String,
				required: [true, 'Please provide name'],
				minlength: 3,
				maxlength: 50,
			},
			email: {
				type: String,
				required: [true, 'Please provide email'],
			},
			role: {
				type: String,
				default: 'customer',
			},
		},
		status: {
			type: String,
			enum: ['pending', 'failed', 'paid', 'delivered', 'canceled'],
			default: 'pending',
		},
		taxRate: {
			type: Number,
			default: 0,
		},
		subTotal: {
			type: Number,
			required: true,
		},
		totalPay: {
			type: Number,
			required: true,
		},
		totalOrderProduct: {
			type: Number,
			required: true,
		},
		orderItems: [singleOrderItemSchema],
		customer: {
			type: mongoose.Types.ObjectId,
			ref: 'Customer',
			required: true,
		},
		payment: {
			type: mongoose.Types.ObjectId,
			ref: 'Payment',
			required: true,
		},
		transaction: {
			type: mongoose.Types.ObjectId,
			ref: 'Transaction',
			required: true,
		},
		historyTransaction: {
			title: {
				type: String,
				required: [true, 'Title is required '],
				minlength: 3,
				maxlength: 50,
			},
			date: {
				type: Date,
				required: [true, 'Date and time are required and cannot be empty'],
			},
			description: {
				type: String,
			},
			tagline: {
				type: String,
				required: [true, 'Tagline is required'],
			},
			keyPoint: {
				type: [String],
			},
			publishedIn: {
				type: String,
				required: [true, 'This Published In is required'],
			},
			image: {
				type: mongoose.Types.ObjectId,
				ref: 'Image',
				required: true,
			},
			category: {
				type: mongoose.Types.ObjectId,
				ref: 'Category',
				required: true,
			},
			company: {
				type: mongoose.Types.ObjectId,
				ref: 'Company',
				required: true,
			},
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
