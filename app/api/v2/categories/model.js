const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
	name: {
		type: String,
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
