const mongoose = require('mongoose');
const argon2 = require('argon2');

const userSchema = new mongoose.Schema(
	{
		avatar: {
			type: mongoose.Types.ObjectId,
			ref: 'Image',
			required: true
		},
		username: {
			type: String,
			unique: [true, "UserName Already Exist"],
			minlength: 3,
		},
		name: {
			type: String,
			required: [true, 'Please provide name'],
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
			enum: ['developer','company', 'owner'],
			default: 'owner',
		},
		status: {
			type: String,
			enum: ['active', 'inactive', 'pending'],
			default: 'inactive',
		},
		currentPlan: {
			type: String,
		},
		billing: {
			type: String,
		},
		company: {
			type: mongoose.Types.ObjectId,
			ref: 'Company',
			required: true,
		},
		otp: {
			type: String,
		},
	},
	{ timestamps: true }
);

// userSchema.path('email').validate(
// 	function (value) {
// 		// eslint-disable-next-line no-useless-escape
// 		const EMAIL_RE = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
// 		return EMAIL_RE.test(value);
// 	},
// 	(attr) => `${attr.value} must be a valid email!`
// );

// userSchema.path('email').validate(
// 	async function (value) {
// 		try {
// 			const count = await this.model('User').countDocuments({
// 				email: value,
// 			});
// 			return !count;
// 		} catch (err) {
// 			console.log('err');
// 			console.log(err);
// 			throw err;
// 		}
// 	},
// 	(attr) => `${attr.value} already exist`
// );

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