const mongoose = require('mongoose');
const argon2 = require('argon2');

const employeeSchema = new mongoose.Schema(
	{
		avatar: { type: String },
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
			enum: ['admin', 'technician', 'operator'],
			default: '-',
		},
		status: {
			type: String,
			enum: ['active', 'not active'],
			default: 'not active',
		},
	},
	{ timestamps: true }
);

employeeSchema.pre('save', async function (next) {
	const User = this;
	if (User.isModified('password')) {
		User.password = await argon2.hash(User.password);
	}
	next();
});

employeeSchema.methods.comparePassword = async function (candidatePassword) {
	const isMatch = await argon2.verify(this.password, candidatePassword);
	return isMatch;
};

module.exports = mongoose.model('Employee', employeeSchema);
