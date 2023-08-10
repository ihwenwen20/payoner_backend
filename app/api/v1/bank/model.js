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
		type: String,
		minlength: [ 10, 'Character length must be between 10 and 20 characters' ],
		maxLength: [ 20, 'Character length must be between 10 and 20 characters' ],
		require: [true, 'Rekening bank number is required'],
		unique: true,
	},
}, { timestamps: true })

module.exports = mongoose.model('Bank', bankSchema)