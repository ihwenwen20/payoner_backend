const mongoose = require('mongoose')

const bankSchema = mongoose.Schema({
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
		require: [true, 'Rekening bank number is required']
	},

}, { timestamps: true })

module.exports = mongoose.model('Bank', bankSchema)