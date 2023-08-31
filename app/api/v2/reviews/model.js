const mongoose = require('mongoose');

const ReviewSchema = mongoose.Schema(
	{
		rating: {
			type: Number,
			min: 1,
			max: 5,
			required: [true, 'Please provide rating'],
		},
		title: {
			type: String,
			trim: true,
			required: [true, 'Please provide review title'],
			maxlength: 100,
		},
		comment: {
			type: String,
			required: [true, 'Please provide review text'],
		},
		company: {
			type: mongoose.Types.ObjectId,
			ref: 'Company',
			required: [true, 'Please provide company'],
		},
		// user: {
		//   type: mongoose.Schema.ObjectId,
		//   ref: 'User',
		//   required: true,
		// },
		product: {
			type: mongoose.Schema.ObjectId,
			ref: 'Product',
			required: true,
		},
	},
	{ timestamps: true }
);
// ReviewSchema.index({ product: 1, user: 1 }, { unique: true });
// Definisikan indeks pada field 'product' dengan opsi 'unique: true'
// Ini memastikan bahwa setiap produk hanya memiliki satu review
ReviewSchema.index({ product: 1, company: 1 }, { unique: true });

// Metode statis untuk menghitung rata-rata rating dan jumlah review
ReviewSchema.statics.calculateAverageRating = async function (productId) {
	// Menggunakan agregasi MongoDB untuk menghitung rata-rata rating dan jumlah review
	const result = await this.aggregate([
		{ $match: { product: productId } },
		{
			$group: {
				_id: null,
				averageRating: { $avg: '$rating' },
				numOfReviews: { $sum: 1 },
			},
		},
	]);

	// Memperbarui rata-rata rating dan jumlah review pada model 'Product'
	try {
		await this.model('Product').findOneAndUpdate(
			{ _id: productId },
			{
				averageRating: Math.ceil(result[0]?.averageRating || 0),
				numOfReviews: result[0]?.numOfReviews || 0,
			}
		);
	} catch (error) {
		console.log(error);
	}
};

// Hook yang berjalan setelah review disimpan
ReviewSchema.post('save', async function () {
	await this.constructor.calculateAverageRating(this.product);
});

// Hook yang berjalan setelah review dihapus
ReviewSchema.post('remove', async function () {
	await this.constructor.calculateAverageRating(this.product);
});


module.exports = mongoose.model('Review', ReviewSchema);