const mongoose = require('mongoose')

const bankSchema = new mongoose.Schema({
	ownerName: {
		type: String,
		require: [true, 'Owner bank name is required']
	},
	bankName: {
		type: String,
		require: [true, 'Bank name is required']
	},
	noRekening: {
		type: Number,
		minlength: [10, 'Character length must be between 10 and 15 characters'],
		maxLength: [15, 'Character length must be between 10 and 15 characters'],
		require: [true, 'Rekening bank number is required'],
		unique: true,
	},
	publisher: {
		type: mongoose.Types.ObjectId,
		ref: 'Company',
		required: true,
	},
}, { timestamps: true })

module.exports = mongoose.model('Bank', bankSchema)