const mongoose = require('mongoose');

const coverageSchema = new mongoose.Schema(
	{
		codeArea: {
			type: String,
			unique: true,
			required: [true, 'Area Code must be filled in'],
		},
		areaName: {
			type: String,
			required: [true, 'Area Name must be filled in'],
		},
		addressId: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Address',
			required: [true, 'addressId must be filled in'],
		}],
		description: {
			type: String,
		},
		status: {
			type: String,
			enum: ['Active', 'Inactive'],
			default: 'Inactive',
			required: true
		},
		radius: {
			type: Number,
		},
		publisher: {
			type: mongoose.Types.ObjectId,
			ref: 'Company',
			required: true,
		},
	},
	{ timestamps: true }
);

// Fungsi untuk menghasilkan kode area dengan format yang diinginkan
function generateCodeArea(orderNumber, locationCode, secondOrderNumber) {
	return `${generatePaddedNumber(orderNumber, 3)}-${locationCode}-${generatePaddedNumber(secondOrderNumber, 5)}`;
}

// Fungsi untuk menghasilkan angka dengan leading zeroes
function generatePaddedNumber(number, length) {
	return String(number).padStart(length, '0');
}

// Hook pre-save  untuk mengisi codeArea sebelum menyimpan
coverageSchema.pre('save', async function (next) {
	if (!this.isModified('codeArea')) {
		return next();
	}

	// Mengambil nilai dari req.body atau menggunakan nilai default jika tidak ada
	const orderNumber = req.body.orderNumber || 1;
	const locationCode = req.body.locationCode || "XYZ";
	const secondOrderNumber = req.body.secondOrderNumber || 1;

	this.codeArea = generateCodeArea(orderNumber, locationCode, secondOrderNumber);
	next();
});


module.exports = mongoose.model('Coverage', coverageSchema);
