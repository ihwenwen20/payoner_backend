const mongoose = require('mongoose');

const productCategoriesSchema = new mongoose.Schema({
	type: {
		type: String,
		required: [ true, 'Product type is required' ],
	},
	price: {
		type: Number,
		default: 0,
	},
	stock: {
		type: Number,
		default: 0,
	},
	statusProductCategories: {
		type: Boolean,
		default: true,
	},
	expired: {
		type: Date,
	},
});

const transactionSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: [ true, 'Title is required' ],
			minlength: 3,
			maxlength: 50,
		},
		date: {
			type: Date,
			required: [ true, 'Date and time are required and cannot be empty' ],
		},
		description: {
			type: String,
		},
		tagline: {
			type: String,
			required: [ true, 'Tagline is required' ],
		},
		keyPoint: {
			type: [ String ],
		},
		publishedIn: {
			type: String,
			required: [ true, 'This Published In is required' ],
		},
		statusTransaction: {
			type: String,
			enum: [ 'Draft', 'Published' ],
			default: 'Draft',
		},
		products: {
			type: [ productCategoriesSchema ],
			required: true,
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
	{timestamps: true}
);

module.exports = mongoose.model('Transaction', transactionSchema);