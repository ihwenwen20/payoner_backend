const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Subcategory Name is required'],
	},
	description: {
		type: String,
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
}, { timestamps: true });

module.exports = mongoose.model('SubCategory', subCategorySchema);
