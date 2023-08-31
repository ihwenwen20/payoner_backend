const mongoose = require('mongoose');
const argon2 = require('argon2');

const companiesSchema = new mongoose.Schema(
	{
		companyName: {
			type: String,
			trim: true,
			required: true,
		},
		email: {
			type: String,
			trim: true,
			unique: true,
		},
		password: {
			type: String,
			trim: true,
			minlength: 6,
			required: true,
		},
		mottoCompany: {
			type: String,
			trim: true,
		},
		about: {
			type: String,
			trim: true,
		},
		logo: {
			type: mongoose.Types.ObjectId,
			ref: 'Image',
		},
		birthday: {
			type: String,
			trim: true,
		},
		contact: {
			type: mongoose.Types.ObjectId,
			ref: 'Contact',
		},
		terms: {
			type: String,
		},
		policy: {
			type: String,
		},
		status: {
			type: String,
			enum: ['Active', 'Inactive', 'Suspend'],
			default: 'Inactive',
			required: true
		},
		speedtest: {
			type: String,
		},
		watermark: {
			type: String,
		},
		owner: {
			type: mongoose.Types.ObjectId,
			ref: 'User',
			required: true
		},
		role: {
			type: String,
			enum: ['Company', 'Admin'],
			default: 'Company',
			required: true
		},
	},
	{ timestamps: true }
);

// Ini memastikan bahwa setiap company hanya memiliki satu owner
// companiesSchema.index({ owner: 1 }, { unique: true });
// // Metode statis untuk menghitung rata-rata rating dan jumlah review
// companiesSchema.statics.calculateAverageRating = async function (userId) {
//   // Menggunakan agregasi MongoDB untuk menghitung rata-rata rating dan jumlah review
//   const result = await this.aggregate([
//     { $match: { owner: userId } },
//     {
//       $group: {
//         _id: null,
//         numOfCompanies: { $sum: 1 },
//       },
//     },
//   ]);

//   // Memperbarui rata-rata rating dan jumlah review pada model 'Product'
//   try {
//     await this.model('User').findOneAndUpdate(
//       { _id: userId },
//       {
//         numOfCompanies: result[0]?.numOfCompanies || 0,
//       }
//     );
//   } catch (error) {
//     console.log(error);
//   }
// };

// // Hook yang berjalan setelah review disimpan
// companiesSchema.post('save', async function () {
//   await this.constructor.calculateAverageRating(this.owner);
// });

// // Hook yang berjalan setelah review dihapus
// companiesSchema.post('remove', async function () {
//   await this.constructor.calculateAverageRating(this.owner);
// });

companiesSchema.pre('save', async function (next) {
	const Company = this;
	if (Company.isModified('password')) {
		try {
			const hashedPassword = await argon2.hash(Company.password);
			Company.password = hashedPassword;
		} catch (error) {
			throw new Error('Failed to encrypt password');
		}
		// Company.password = await argon2.hash(Company.password);
	}
	next();
});

companiesSchema.methods.comparePassword = async function (candidatePassword) {
	try {
		const isMatch = await argon2.verify(this.password, candidatePassword);
		return isMatch;
	} catch (error) {
		throw new Error('Failed to compare password');
	}
};

module.exports = mongoose.model('Company', companiesSchema);
