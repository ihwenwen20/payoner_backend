const mongoose = require('mongoose');

const faqQAndASchema = new mongoose.Schema({
	answer: {
		type: String,
	},
	question: {
		type: String,
	},
});

const faqSchema = new mongoose.Schema({
	icon: {
		type: String,
	},
	title: {
		type: String,
	},
	subtitle: {
		type: String,
	},
	qandA: {
		type: [faqQAndASchema],
		required: true,
	},
});

module.exports = mongoose.model('Faq', faqSchema);