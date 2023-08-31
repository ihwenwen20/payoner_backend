const mongoose = require('mongoose');

const SingleOrderItemSchema = mongoose.Schema({
	name: { type: String, required: true },
	image: { type: String, required: true },
	price: { type: Number, required: true },
	amount: { type: Number, required: true },
	inventory: { type: Number, required: true },
	product: {
		type: mongoose.Schema.ObjectId,
		ref: 'Product',
		required: true,
	},
});

const OrderSchema = mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, 'Title is required'],
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
		// publishedIn: {
		// 	type: String,
		// 	required: [true, 'This Published In is required'],
		// },
		tax: {
			type: Number,
			default: 0,
		},
		shippingFee: {
			type: Number,
			default: 0,
		},
		subtotal: {
			type: Number,
			required: true,
		},
		totalWithShipping: {
			type: Number,
			required: true,
		},
		total: {
			type: Number,
			required: true,
		},
		orderItems: [SingleOrderItemSchema],
		status: {
			type: String,
			enum: ['Pending', 'Failed', 'Paid', 'Delivered', 'Canceled'],
			default: 'Pending',
		},
		statusTransaction: {
			type: String,
			enum: ['Draft', 'Published'],
			default: 'Draft',
		},
		clientSecret: {
			type: String,
			required: true,
		},
		paymentIntentId: {
			type: String,
		},
		paymentId: {
			type: mongoose.Types.ObjectId,
			ref: 'Payment',
			required: true,
		},
		customer: {
			type: mongoose.Types.ObjectId,
			ref: 'Customer',
			required: true,
		},
		// personalDetail: {
		// 	name: {
		// 		type: String,
		// 		trim: true,
		// 		required: [true, 'Please provide name'],
		// 		minlength: 3,
		// 		maxlength: 50,
		// 	},
		// 	email: {
		// 		type: String,
		// 		trim: true,
		// 		unique: true,
		// 		required: [true, 'Please provide email'],
		// 	},
		// 	role: {
		// 		type: String,
		// 		default: 'Client',
		// 		// required: true
		// 	},
		// },
		historyTransaction: {
			date: {
				type: Date,
				required: [true, 'Date and time are required and cannot be empty'],
			},
			description: {
				type: String,
			},
			publishedIn: {
				type: String,
				required: [true, 'This Published In is required'],
			},
			category: {
				type: mongoose.Types.ObjectId,
				ref: 'SubCategory',
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

module.exports = mongoose.model('Order', OrderSchema);