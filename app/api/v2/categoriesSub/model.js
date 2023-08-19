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
}, { timestamps: true });

module.exports = mongoose.model('SubCategory', subCategorySchema);
