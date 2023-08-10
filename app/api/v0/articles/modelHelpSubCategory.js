const mongoose = require('mongoose');

const helpCenterSubcategoryArticlesSchema = new mongoose.Schema({
	slug: {
		type: String,
	},
	title: {
		type: String,
	},
	content: {
		type: String,
	},
});

const helpCenterSubcategoriesSchema = new mongoose.Schema({
	icon: {
		type: String,
	},
	slug: {
		type: String,
	},
	title: {
		type: String,
	},
	articles: {
		type: [helpCenterSubcategoryArticlesSchema],
		required: true,
	},
});

const HelpCenterCategoriesSchema = new mongoose.Schema({
	icon: {
		type: String,
	},
	slug: {
		type: String,
	},
	title: {
		type: String,
	},
	avatarColor: {
		type: String,
	},
	subCategories: {
		type: [helpCenterSubcategoriesSchema],
		required: true,
	},
});

module.exports = mongoose.model('Help', HelpCenterCategoriesSchema);

// export type HelpCenterCategoriesType = {
//   icon: string
//   slug: string
//   title: string
//   avatarColor: ThemeColor
//   subCategories: HelpCenterSubcategoriesType[]
// }
// export type HelpCenterArticlesOverviewType = {
//   img: string
//   slug: string
//   title: string
//   subtitle: string
// }