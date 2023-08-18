const Users = require("../../api/v2/users/model");
const Companies = require("../../api/v2/companies/model");
const Contact = require('../../api/v2/contacts/model');
const UserRefreshToken = require('../../api/v2/userRefreshToken/model');
const { NotFoundError, BadRequestError, UnauthorizedError } = require("../../errors");
const {
	generateToken,
	createJWT,
	createRefreshJWT,
	attachCookiesToResponse,
	isTokenValid,
	isTokenValidRefreshToken,
	validateResetToken,
	clearResetToken
} = require("../../utils/jwt");
const { createTokenUser, } = require("../../utils/createTokenUser");
const { otpMail } = require('../mail');
const { createUserRefreshToken } = require("./refreshToken");
const { checkingImage, createImages } = require('./images');

const signupUser = async (req, res) => {
	const { avatar, companyName, email, password, confirmPassword, name, phone, } = req.body;
	if (!name || !companyName || !email || !password || !confirmPassword) {
		throw new BadRequestError("Please provide all required fields");
	}
	if (password !== confirmPassword) throw new BadRequestError("Password and confirm password do not match");

	const existingUser = await Users.findOne({ email });
	if (existingUser) throw new BadRequestError(`User with this email: ${email} already exists`);

	try {
		// first registered Users is an owner
		const isFirstAccount = (await Users.countDocuments({})) === 0;
		const role = isFirstAccount ? 'developer' : 'owner';
		const status = isFirstAccount ? 'active' : 'inactive';
		// const avatar = await createImages(avatar);
		await checkingImage(avatar);
		// const companies = await Companies.create({ companyName, password, owner: user._id });
		const contact = await Contact.create({ name, email, phone });
		const user = await Users.create({
			name, email, password, role, status,
			// avatar: avatar._id,
			avatar,
			// company: companies._id,
			contact: contact._id,
			otp: Math.floor(Math.random() * 999999)
		});
		delete user._doc.password;
		delete user._doc.otp;

		const companies = await Companies.create({ companyName, email, password, owner: user._id });


		let checkMail = await Users.findOne({
			email,
			status: "inactive",
		});
		// await otpMail(email, checkMail);

		// Generate token
		// if (user) {
		// 	generateToken(res, user._id);
		// }
		const result = createTokenUser(user);
		attachCookiesToResponse({ res, user: result });
		return {
			msg: 'Register Oke. Please Activated Account with OTP Code from your email!',
			data: user,
			result
		}
	} catch (err) {
		console.log(err)
		throw err
	}
};

const signinUser = async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) throw new BadRequestError("Please provide email and password");

		const user = await Users.findOne({
			email,
			status: "active",
		});

		if (!user) throw new UnauthorizedError("Invalid Credentials, Please Activated Your Account");

		const isPasswordCorrect = await user.comparePassword(password);
		if (!isPasswordCorrect) throw new UnauthorizedError("Invalid Credentials");

		const accessToken = createJWT({ payload: createTokenUser(user) });
		const refreshToken = createRefreshJWT({ payload: createTokenUser(user) });
		await createUserRefreshToken({
			refreshToken,
			user: user._id,
		});

		const oneDay = 1000 * 60 * 60 * 24;
		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			maxAge: new Date(Date.now() + oneDay),
			secure: process.env.MODE !== 'development', // Use secure cookies in production
			sameSite: 'strict', // Prevent CSRF attacks
			signed: true,
		});
		// req.session.userId = accessToken
		return {
			accessToken,
			refreshToken,
			name: user.name,
			email: user.email,
			role: user.role,
			avatar: user.avatar,
		}
	} catch (err) {
		throw err
	}
};

const activateUser = async (req) => {
	const { otp, email } = req.body;
	const check = await Users.findOne({
		email,
	});

	if (!check) throw new UnauthorizedError("User with this email does not registered");

	if (check && check.otp !== otp) throw new BadRequestError("OTP Code is wrong");

	const users = await Users.findByIdAndUpdate(
		check._id,
		{
			status: "active",
		},
		{ new: true }
	);
	// const token = createJWT({ payload: createTokenUser(users) });
	// attachCookiesToResponse({ res, users: token });
	// res.status(StatusCodes.CREATED).json({ users: token });

	delete users._doc.password;
	delete users._doc.otp;

	return users;
	// return { token, users };
};

const getRefreshToken = async (req) => {
	const { refreshToken } = req.params;
	const result = await UserRefreshToken.findOne().populate({
		path: 'user',
		select: '_id name email role',
	});

	if (!result) throw new NotFoundError('Mohon login ke akun Anda! refreshToken tidak valid');

	const payload = isTokenValidRefreshToken({ token: result.refreshToken });

	const userCheck = await Users.findOne({ email: payload.email });

	const accessToken = createJWT({ payload: createTokenUser(userCheck) });

	const newrefreshToken = createRefreshJWT({ payload: createTokenUser(result) });
	await createUserRefreshToken({
		refreshToken,
		user: result._id,
	});

	// return result;
	return { accessToken, refreshtoken: newrefreshToken };
};

const logoutUser = async (req, res) => {
	res.clearCookie('refreshToken');
	// req.session.destroy((err) => {
	// 	if (err) console.error("Deleted Sessions Failed:", err);

	// 	console.log({ msg: 'Logout Success!' });
	// });
};

const requestPasswordReset = async (req, res) => {
	const { email } = req.body;

	if (!email) {
		throw new BadRequestError("Please provide an email address");
	}

	const user = await Users.findOne({ email });
	if (!user) {
		throw new NotFoundError("User with this email not found");
	}

	// const resetToken = generateResetToken(user._id);
	const resetToken = createRefreshJWT({ payload: createTokenUser(user) });
	await createUserRefreshToken({
		refreshToken: resetToken,
		user: user._id,
	});

	// sendPasswordResetEmail(user.email, resetToken);

	return {
		msg: "Password reset link sent to your email",
		email: user.email,
		resetToken
	};
};

const resetPassword = async (req, res) => {
	const { refreshToken } = req.params;
	// console.log(refreshToken)
	const { newPassword, confirmPassword } = req.body;
	if (!newPassword || !confirmPassword) {
		throw new BadRequestError("Please provide all fields");
	}
	if (newPassword !== confirmPassword) throw new BadRequestError("Password and confirm password do not match");

	const payload = isTokenValidRefreshToken({ token: refreshToken });
	// console.log('payload', payload)
	const resetTokenFromDB = await UserRefreshToken.findOne({
		user: payload.userId, refreshToken
	});
	// console.log(resetTokenFromDB)
	if (!resetTokenFromDB) throw new Error("Reset Password Token not found");

	const userCheck = await Users.findOne({ email: payload.email });
	// console.log('payload', userCheck)
	userCheck.password = newPassword;
	await userCheck.save();

	const clearResetToken = await UserRefreshToken.findOneAndDelete({ user: userCheck._id, refreshToken });
	// console.log(clearResetToken)
	return { msg: "Password has been reset successfully" };
};

const changePassword = async (req, res) => {
	// const { refreshToken } = req.params;
	const { oldPassword, newPassword, confirmPassword } = req.body;
	if (!oldPassword || !newPassword || !confirmPassword) {
		throw new BadRequestError("Please provide all fields");
	}
	if (newPassword !== confirmPassword) throw new BadRequestError("Password and confirm password do not match");

	const resetTokenFromDB = await UserRefreshToken.findOne().populate({
		path: 'user',
		select: '_id name email',
	});
	if (!resetTokenFromDB) throw new Error("Reset token not found in the database or does not match");

	// const payload = isTokenValidRefreshToken({ token: resetTokenFromDB.refreshToken });
	// const userCheck = await Users.findOne({ email: payload.email });
	const userCheck = await Users.findOne({  _id: req.user.userId  });
	// console.log('payload', userCheck)
	const isPasswordCorrect = await userCheck.comparePassword(oldPassword);
	if (!isPasswordCorrect) {
		throw new UnauthorizedError('Invalid Credentials');
	}
	userCheck.password = newPassword;
	await userCheck.save();

	// const clearResetToken = await UserRefreshToken.findOneAndDelete({ user: payload._id, refreshToken });
	// console.log(clearResetToken)
	return { msg: "Password has been reset successfully" };
};

const sendVerificationEmail = async (email, verificationToken) => {
  // Buat tautan verifikasi yang mengarahkan ke endpoint verifikasi di aplikasi Anda
  const verificationLink = `https://yourapp.com/verify?token=${verificationToken}`;

  // Kirim email verifikasi ke pengguna
  const mailOptions = {
    to: email,
    subject: 'Email Verification',
    text: `Click the following link to verify your email: ${verificationLink}`,
  };

  await sendEmailFunction(mailOptions); // Ganti dengan kode pengiriman email Anda
};

// const signupUser = async (req, res) => {
//   // ... kode validasi dan pembuatan pengguna ...

//   // Buat token verifikasi
//   const verificationToken = createVerificationToken(user._id);

//   // Kirim email verifikasi
//   await sendVerificationEmail(user.email, verificationToken);

//   return {
//     msg: 'Register successful. Please verify your email by clicking the link sent to your email!',
//     data: user,
//   };
// };

const sendPasswordResetEmail = async (email, resetToken) => {
  // Buat tautan pemulihan kata sandi yang mengarahkan ke endpoint pemulihan kata sandi di aplikasi Anda
  const resetLink = `https://yourapp.com/reset-password?token=${resetToken}`;

  // Kirim email pemulihan kata sandi ke pengguna
  const mailOptions = {
    to: email,
    subject: 'Password Reset',
    text: `Click the following link to reset your password: ${resetLink}`,
  };

  await sendEmailFunction(mailOptions); // Ganti dengan kode pengiriman email Anda
};




module.exports = {
	signupUser,
	signinUser,
	activateUser,
	getRefreshToken,
	logoutUser,
	requestPasswordReset,
	resetPassword,
	changePassword
};
