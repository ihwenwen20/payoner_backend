const mongoose = require('mongoose');
const argon2 = require('argon2');

const customerSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Name is required'],
			minlength: 3,
			maxlength: 50,
		},
		email: {
			type: String,
			unique: true,
			required: [true, 'Email is required'],
		},
		password: {
			type: String,
			required: [true, 'Password is required'],
			minlength: 6,
		},
		role: {
			type: String,
			default: '-',
		},
		status: {
			type: String,
			enum: ['active', 'not active'],
			default: 'not active',
		},
		otp: {
			type: String,
			required: true,
		},
		avatar: { type: String },
		fileName: { type: String },
		phoneNumber: {
			type: String,
			require: true,
			maxlength: [13, "panjang nomor telpon harus antara 9 - 13 karakter"],
			minlength: [9, "panjang nomor telpon harus antara 9 - 13 karakter"]
		},
	},
	{ timestamps: true }
);

customerSchema.pre('save', async function (next) {
	const User = this;
	if (User.isModified('password')) {
		User.password = await argon2.hash(User.password);
	}
	next();
});

customerSchema.methods.comparePassword = async function (candidatePassword) {
	const isMatch = await argon2.verify(this.password, candidatePassword);
	return isMatch;
};

module.exports = mongoose.model('Customer', customerSchema);
