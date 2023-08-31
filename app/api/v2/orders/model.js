const mongoose = require('mongoose');
// const historyTransactionSchema = require('../transactions/model');

const SingleOrderItemSchema = mongoose.Schema({
	name: { type: String, required: true },
	// image: { type: String, required: true },
	price: { type: Number, required: true },
	amount: { type: Number, required: true },
	// inventory: { type: Number, required: true },
	product: {
		type: mongoose.Schema.ObjectId,
		ref: 'Product',
		required: true,
	},
});

const historyTransactionSchema = mongoose.Schema({
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
	publishedIn: {
		type: String,
		required: [true, 'This Published In is required'],
	},
	subCategory: {
		type: mongoose.Types.ObjectId,
		ref: 'SubCategory',
		// required: true,
	},
	category: {
		type: mongoose.Types.ObjectId,
		ref: 'Category',
		// required: true,
	},
	amount: {
		type: Number,
		required: true,
	},
	currency: {
		type: String,
		required: true,
	},
	status: {
		type: String,
		enum: ['Success', 'Failed', 'Pending', 'Cancelled'],
		default: 'Pending',
	},
	additionalInfo: {
		type: String,
	},
	company: {
		type: mongoose.Types.ObjectId,
		ref: 'Company',
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
		publishedIn: {
			type: String,
			required: [true, 'This Published In is required'],
		},
		tax: {
			type: Number,
			default: 0
		},
		discount: {
			type: Number,
			default: 0
		},
		calculateTax: {
			type: Number
		},
		subtotal: {
			type: Number,
			required: true,
		},
		total: {
			type: Number,
			required: true,
		},
		totalWithDiscount: {
			type: Number,
		},
		orderItems: [SingleOrderItemSchema],
		status: {
			type: String,
			enum: ['Unpaid', 'Paid', 'Failed', 'Cancelled'],
			default: 'Unpaid',
		},
		// statusTransaction: {
		// 	type: String,
		// 	enum: ['Draft', 'Published'],
		// 	default: 'Draft',
		// },
		// clientSecret: {
		// 	type: String,
		// 	required: true,
		// },
		paymentIntentId: {
			type: String,
		},
		// paymentId: {
		// 	type: mongoose.Types.ObjectId,
		// 	ref: 'Payment',
		// 	required: true,
		// },
		customer: {
			type: mongoose.Types.ObjectId,
			ref: 'Customer',
			required: true,
		},
		company: {
			type: mongoose.Types.ObjectId,
			ref: 'Company',
			required: true,
		},
		// historyTransaction: {
		// 	title: {
		// 		type: String,
		// 		required: [true, 'Title is required'],
		// 		minlength: 3,
		// 		maxlength: 50,
		// 	},
		// 	date: {
		// 		type: Date,
		// 		required: [true, 'Date and time are required and cannot be empty'],
		// 	},
		// 	description: {
		// 		type: String,
		// 	},
		// 	publishedIn: {
		// 		type: String,
		// 		required: [true, 'This Published In is required'],
		// 	},
		// 	company: {
		// 		type: mongoose.Types.ObjectId,
		// 		ref: 'Company',
		// 		required: true,
		// 	},
		// },

		// historyTransaction: {
		// 	type: {
		// 		title: String,
		// 		date: Date,
		// 		description: String,
		// 		publishedIn: String,
		// 		company: {
		// 			type: mongoose.Types.ObjectId,
		// 			ref: 'Company',
		// 			required: true,
		// 		},
		// 	},
		// 	default: null // Nilai default untuk historyTransaction
		// },
		// historyTransaction: {
		// 	type: historyTransactionSchema,
		// 	default: null,
		// },
	},
	{ timestamps: true }
);

OrderSchema.pre('save', async function (next) {
	// Hanya jalankan ini jika historyTransaction tidak ada
	if (!this.historyTransaction) {
		this.historyTransaction = {
			title: this.title,
			date: this.date,
			description: this.description,
			publishedIn: this.publishedIn,
			company: this.company,
			subCategory: this.subCategory,
			category: this.category,
			amount: this.total,
			currency: 'IDR',
			status: 'Pending',
			additionalInfo: '',
		};
	}
	next();
});

module.exports = mongoose.model('Order', OrderSchema);