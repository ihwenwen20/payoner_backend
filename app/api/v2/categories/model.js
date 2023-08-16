const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
	name: {
		type: String,
		minlength: [ 3, 'The category name must be at least 3 characters long' ],
		maxLength: [ 20, 'The maximum length of the category name is 20 characters' ],
		required: [ true, 'Category Name is required' ],
	},
	company: {
		type: mongoose.Types.ObjectId,
		ref: 'Company',
		required: true,
	},
}, {timestamps: true}
);

module.exports = mongoose.model('Category', categorySchema);
