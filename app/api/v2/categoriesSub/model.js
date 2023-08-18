const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Subcategory Name is required'],
	},
	category: {
		type: mongoose.Types.ObjectId,
		ref: 'Category',
		required: true,
	},
	// Add any additional fields relevant to subcategories
}, { timestamps: true });

module.exports = mongoose.model('SubCategory', subCategorySchema);
