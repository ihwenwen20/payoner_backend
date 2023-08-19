const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
	{
		SKU: {
			type: String,
			unique: true,
			trim: true,
			required: true
		},
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
		image: {
			// type: String,
			// default: '/images/products/brosur.png',
			type: mongoose.Types.ObjectId,
			ref: 'Image',
			required: true
		},
		category: {
			type: mongoose.Types.ObjectId,
			ref: 'SubCategory',
			required: [true, 'Please provide product category'],
		},
		company: {
			type: String,
			required: [true, 'Please provide company'],
		},
		colors: {
			type: [String],
			default: ['#222'],
			required: true,
		},
		featured: {
			type: Boolean,
			default: false,
		},
		freeShipping: {
			type: Boolean,
			default: false,
		},
		inventory: {
			type: Number,
			required: true,
		},
		averageRating: {
			type: Number,
			default: 0,
		},
		numOfReviews: {
			type: Number,
			default: 0,
		},
		status: {
			type: String,
			enum: ['Inactive', 'Published', 'Scheduled'],
			default: 'Inactive',
			required: true
		},
		// user: {
		//   type: mongoose.Types.ObjectId,
		//   ref: 'User',
		//   required: true,
		// },
	},
	{ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

ProductSchema.virtual('reviews', {
	ref: 'Review',
	localField: '_id',
	foreignField: 'product',
	justOne: false,
});

ProductSchema.pre('remove', async function (next) {
	await this.model('Review').deleteMany({ product: this._id });
});

module.exports = mongoose.model('Product', ProductSchema);