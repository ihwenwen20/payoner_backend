const mongoose = require('mongoose');
const argon2 = require('argon2');

const userSchema = new mongoose.Schema(
	{
		avatar: {
			type: String
		},
		name: {
			type: String,
			required: [true, 'Please provide name'],
			unique: true,
			minlength: 3,
			maxlength: 50,
		},
		email: {
			type: String,
			unique: true,
			required: [true, 'Please provide email'],
		},
		password: {
			type: String,
			required: [true, 'Password is required'],
			minlength: 6,
		},
		contact: {
			type: mongoose.Types.ObjectId,
			ref: 'Contact',
		},
		role: {
			type: String,
			enum: ['admin', 'company', 'owner', 'user', 'client', 'technician', 'operator'],
			default: 'admin',
		},
		status: {
			type: String,
			enum: ['active', 'not active'],
			default: 'not active',
		},
		otp: {
			type: String,
		},
		company: {
			type: mongoose.Types.ObjectId,
			ref: 'Company',
			required: true,
		},
	},
	{ timestamps: true }
);

userSchema.path('email').validate(
	function (value) {
		// eslint-disable-next-line no-useless-escape
		const EMAIL_RE = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
		return EMAIL_RE.test(value);
	},
	(attr) => `${attr.value} must be a valid email!`
);

userSchema.path('email').validate(
	async function (value) {
		try {
			const count = await this.model('User').countDocuments({
				email: value,
			});
			return !count;
		} catch (err) {
			console.log('err');
			console.log(err);
			throw err;
		}
	},
	(attr) => `${attr.value} already exist`
);

userSchema.pre('save', async function (next) {
	const User = this;
	if (User.isModified('password')) {
		try {
			const hashedPassword = await argon2.hash(User.password);
			User.password = hashedPassword;
		} catch (error) {
			throw new Error('Failed to encrypt password');
		}
		// User.password = await argon2.hash(User.password);
	}
	next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
	try {
		const isMatch = await argon2.verify(this.password, candidatePassword);
		return isMatch;
	} catch (error) {
		throw new Error('Failed to compare password');
	}
};

module.exports = mongoose.model('User', userSchema);