const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			trim: true,
			required: [true, 'Please provide product name'],
			maxlength: [100, 'Name can not be more than 100 characters'],
		},
		price: {
			type: Number,
			trim: true,
			required: [true, 'Please provide product price'],
			default: 0,
		},
		description: {
			type: String,
			required: [true, 'Please provide product description'],
			maxlength: [1000, 'Description can not be more than 1000 characters'],
		},
		image: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Image',
			required: true
		}],
		category: {
			type: mongoose.Types.ObjectId,
			ref: 'SubCategory',
			required: [true, 'Please provide product category'],
		},
		company: {
			type: mongoose.Types.ObjectId,
			ref: 'Company',
			required: [true, 'Please provide company'],
		},
		// inventory: {
		// 	type: Number,
		// 	required: true,
		// },
		status: {
			type: String,
			enum: ['Draft', 'Published'],
			default: 'Published',
			required: true
		},
	},
	{ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

module.exports = mongoose.model('Product', ProductSchema);