const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema(
	{
		url: { type: String },
		// path: String,
		// url: String,
		// caption: String,
		// createdAt: Date
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Image', imageSchema);

// const schema = new mongoose.Schema(
//   {
//     // ... definisi field lainnya ...
//     createdAt: { type: Date, default: new Date(Date.now() + (-1 * new Date().getTimezoneOffset() * 60000)).toISOString() },
//     updatedAt: { type: Date, default: new Date(Date.now() + (-1 * new Date().getTimezoneOffset() * 60000)).toISOString() }
//   }
// );

// // Pre-save hook untuk mengatur updatedAt secara otomatis
// schema.pre('save', function (next) {
//   this.updatedAt = new Date(Date.now() + (-1 * new Date().getTimezoneOffset() * 60000)).toISOString();
//   next();
// });


// path: String,
// 	url: String,
// 		caption: String,
// 			createdAt: Date