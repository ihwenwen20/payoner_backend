const mongoose = require('mongoose');
const argon2 = require('argon2');

const customerSchema = new mongoose.Schema(
	{
		avatar: {
			type: mongoose.Types.ObjectId,
			ref: 'Image',
			required: true
		},
		username: {
			type: String,
			trim: true,
			unique: [true, "UserName Already Exist"],
			minlength: 2,
		},
		name: {
			type: String,
			trim: true,
			required: [true, 'Please provide name'],
			minlength: 3,
			maxlength: 50,
		},
		email: {
			type: String,
			trim: true,
			unique: true,
			required: [true, 'Please provide email'],
		},
		password: {
			type: String,
			trim: true,
			required: [true, 'Password is required'],
			minlength: 6,
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
		role: {
			type: String,
			default: 'Client',
			required: true
		},
		status: {
			type: String,
			enum: ['Active', 'Inactive', 'Pending', 'Suspend', 'Free'],
			default: 'Inactive',
			required: true
		},
		otp: {
			type: String,
			required: true,
		},
		company: {
			type: mongoose.Types.ObjectId,
			ref: 'Company',
		},
		purchases: {
			type: Array,
			default: [],
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
