const mongoose = require('mongoose')

const voucherSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'Voucher name is required']
  },
  status: {
    type: String,
    enum: ['Y', 'N'],
    default: 'Y'
  },
  disposable: {
    type: String,
    enum: ['Y', 'N'],
    default: 'N'
  },
  thumbnail: {
    type: String
  },
  category: {
    type: mongoose.Types.ObjectId,
    ref: 'Category'
  },
  // nominals: [{
  //   type: mongoose.Types.ObjectId,
  //   ref: 'Nominal'
  // }],
	company: {
		type: mongoose.Types.ObjectId,
		ref: 'Company',
		required: true,
	},
}, { timestamps: true })

module.exports = mongoose.model('Voucher', voucherSchema)