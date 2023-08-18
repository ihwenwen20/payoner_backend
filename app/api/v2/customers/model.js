const mongoose = require('mongoose');
const argon2 = require('argon2');

const customerSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			unique: [true, "UserName Already Exist"],
			minlength: 2,
		},
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
			default: 'Client',
		},
		status: {
			type: String,
			enum: ['active', 'inactive', 'pending', 'suspend'],
			default: 'inactive',
		},
		otp: {
			type: String,
			required: true,
		},
		avatar: {
			type: mongoose.Types.ObjectId,
			ref: 'Image',
			required: true
		},
		gender: {
			type: String,
			enum: ['Male', 'Female'],
		},
		birthday: {
			type: String,
		},
		contact: {
			type: mongoose.Types.ObjectId,
			ref: 'Contact',
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
