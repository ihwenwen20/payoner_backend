const Users = require("../../api/v2/users/model");
const Company = require("../../api/v2/companies/model");
const Contact = require("../../api/v2/contacts/model");
const UserRefreshToken = require('../../api/v2/userRefreshToken/model');
const { NotFoundError, BadRequestError, UnauthorizedError, DuplicateError } = require("../../errors");
const {
	createJWT,
	createRefreshJWT,
	isTokenValidRefreshToken,
	attachCookiesToResponse,
	isTokenValid,
	generateToken,
	validateResetToken,
	clearResetToken
} = require("../../utils/jwt");
const jwt = require('jsonwebtoken');
const {
	jwtSecret,
	jwtExpiration,
	jwtRefreshTokenExpiration,
	jwtRefreshTokenSecret,
} = require('../../config');
const { createTokenUser, createTokenCompany, } = require("../../utils/createTokenUser");
const { otpMail } = require('../mail');
const { createUserRefreshToken } = require("./refreshToken");
const { checkingImage } = require('./images');
const { createContact } = require('./contact');
const { createCompany } = require('./companies');

// const signupUser = async (req, res) => {
// 	const { username, name, email, password, confirmPassword, avatar } = req.body;

// 	if (!username || !name || !email || !password || !confirmPassword) throw new NotFoundError(username, name, email, password, confirmPassword, companyName);
// 	if (password !== confirmPassword) throw new BadRequestError("Password and Confirm Password do not match");

// 	const check = await Users.findOne({ username, email });
// 	if (check) throw new DuplicateError(username, email);
// 	// console.log('check', check)
// 	const isFirstAccount = (await Users.countDocuments({})) === 0;
// 	const role = isFirstAccount ? 'Developer' : 'Owner';
// 	const status = isFirstAccount ? 'Active' : 'Inactive';
// 	const avatars = await checkingImage(avatar)
// 	const contacts = await createContact(req)
// 	// console.log('avatar', avatars)
// 	// console.log('contact', contacts)

// 	const users = new Users({
// 		...req.body, role, status,
// 		avatar: avatars._id,
// 		// companies: companies.data._id,
// 		contact: contacts.data._id,
// 		otp: Math.floor(Math.random() * 999999),
// 	});
// 	await users.save();
// 	if (!users || !users.contact || users.contact.length === 0) {
// 		console.log("User or user's contact is empty");
// 		await Contact.findByIdAndDelete(contacts.data._id);
// 		await users.deleteOne();
// 		throw new BadRequestError("Invalid Contact Data.");
// 	};
// 	// console.log('users data', users)
// 	// const companies = await createCompany(users._id, req)
// 	// console.log('company', companies)

// 	delete users._doc._id;
// 	delete users._doc.password;
// 	delete users._doc.otp;
// 	delete users._doc.role;
// 	delete users._doc.status;


// 	let checkMail = await Users.findOne({
// 		email,
// 		status: "Inactive",
// 	});
// 	// await otpMail(email, checkMail);

// 	// Generate token
// 	// if (user) {
// 	// 	generateToken(res, user._id);
// 	// }
// 	// const result = createTokenUser(users);
// 	// console.log('result token', result)
// 	// attachCookiesToResponse({ res, user: result });
// 	return {
// 		msg: 'Register Oke! Please Activated Account with OTP Code from your email.',
// 		data: users,
// 		// result
// 	}
// };

const signupUser = async (req, res) => {
	const { username, name, email, password, confirmPassword, avatar } = req.body;

	if (!username || !name || !email || !password || !confirmPassword) throw new NotFoundError(username, name, email, password, confirmPassword, companyName);
	if (password !== confirmPassword) throw new BadRequestError("Password and Confirm Password do not match");

	const check = await Users.findOne({ username, email });
	if (check) throw new DuplicateError(username, email);
	// console.log('check', check)
	const isFirstAccount = (await Users.countDocuments({})) === 0;
	const role = isFirstAccount ? 'Developer' : 'Owner';
	const status = isFirstAccount ? 'Active' : 'Inactive';
	const avatars = await checkingImage(avatar)
	const contacts = await createContact(req)
	// console.log('avatar', avatars)
	// console.log('contact', contacts)

	const users = new Users({
		...req.body, role, status,
		avatar: avatars._id,
		contact: contacts.data._id,
		otp: Math.floor(Math.random() * 999999),
	});
	await users.save();
	if (!users || users.length === 0 || !users.contact || users.contact.length === 0) {
		console.log("User or user's contact is empty");
		await Contact.findByIdAndDelete(contacts.data._id);
		await users.deleteOne();
		throw new BadRequestError("Invalid Contact Data.");
	};
	console.log('users data', users)

	const isFirstCompany = (await Company.countDocuments({})) === 0;
	const companyRole = isFirstCompany ? 'Company' : 'Admin';
	const companyStatus = isFirstCompany ? 'Active' : 'Inactive';
	const company = new Company({
		...req.body,
		role: companyRole,
		status: companyStatus,
		phone: req.body.companyPhone,
		address: req.body.companyAddress,
		owner: users._id,
	});
	await company.save();
	console.log('company', company)

	users.companies.push(company._id);
	await users.save();

	console.log('users data update', users)
	// const companies = await createCompany(users._id, req)

	delete users._doc._id;
	delete users._doc.password;
	delete users._doc.otp;
	delete users._doc.role;
	delete users._doc.status;


	let checkMail = await Users.findOne({
		email,
		status: "Inactive",
	});
	// await otpMail(email, checkMail);

	// Generate token
	// if (user) {
	// 	generateToken(res, user._id);
	// }
	// const result = createTokenUser(users);
	// console.log('result token', result)
	// attachCookiesToResponse({ res, user: result });
	return {
		msg: 'Register Oke! Please Activated Account with OTP Code from your email.',
		data: users,
		// result
	}
};

const signinUser = async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) throw new BadRequestError("Please provide email and password");

		const user = await Users.findOne({
			email,
			status: "Active",
		});
		if (!user) throw new UnauthorizedError("Access Denied!!! Invalid Credentials. Contact the Owner to Activated Your Account");
		if (!user.name) throw new BadRequestError("User data is incomplete. Please update your profile before generating tokens.");

		const isPassword = await user.comparePassword(password);
		if (!isPassword) throw new UnauthorizedError("Invalid Credentials. Password does no match!");

		const isRefreshToken = await UserRefreshToken.findOne({ user: user._id });
		if (isRefreshToken) {
			await isRefreshToken.deleteOne();
		}

		// const accessToken = createJWT({ payload: createTokenUser(user) });
		// const refreshToken = createRefreshJWT({ payload: createTokenUser(user) });
		const accessToken = jwt.sign(
			{
				userId: user._id,
				username: user.username,
				name: user.name,
				email: user.email,
				role: user.role,
			},
			jwtSecret,
			{
				expiresIn: '1d',
				// expiresIn: '30m', // Shorter expiration for access token
			}
		);

		const refreshToken = jwt.sign(
			{
				userId: user._id,
				username: user.username,
				name: user.name,
				email: user.email,
				role: user.role,
			},
			jwtRefreshTokenSecret,
			{
				expiresIn: '7d', // Longer expiration for refresh token
			}
		);
		const newRefreshToken = new UserRefreshToken({
			refreshToken,
			user: user._id,
		});
		await newRefreshToken.save();

		const oneDay = 1000 * 60 * 60 * 24 * 3;  // 3 hari dlm hitungan milisecond
		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			maxAge: new Date(Date.now() + oneDay),
			secure: process.env.MODE !== 'development', // Use secure cookies in production
			sameSite: 'strict', // Prevent CSRF attacks
			signed: true,
		});
		// req.session.userId = accessToken
		return {
			msg: `Greet, Bos. Login Successfully. Welcome ${user.username} :)`,
			accessToken,
			refreshToken,
			userId: user._id,
			username: user.username,
			name: user.name,
			role: user.role,
			email: user.email,
			companies: user.companies,
			avatar: user.avatar,
		}
	} catch (err) {
		throw err
	}
};

const signinCompanies = async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) throw new BadRequestError("Please provide email and password");

		let user = await Users.findOne({
			email,
			status: "Active",
		});

		console.log("user1:", user);
		let company = null;
		if (!user) {
			company = await Company.findOne({
				email,
				status: "Active",
			});
			if (!company) {
				throw new UnauthorizedError("Access Denied!!! Invalid Credentials. Please Confirm Activate Account to Owner");
			}
		}

		console.log("user:", user);
		console.log("company:", company);

		const isPassword = user ? await user.comparePassword(password) : await company.comparePassword(password);;
		if (!isPassword) throw new UnauthorizedError("Invalid Credentials. Access Denied! Password does no match!");
		let entity = user || company;
		let companyId = null; // Initialize companyId as null

		if (entity === company) {
			companyId = entity._id; // Assign companyId if entity is company
		} else if (entity === user) {
			companyId = user.companies; // Use user's companies if entity is user
			// const userCompanies = user.companies; // Get the user's companies array
			// const test = await Company.find({
			// 	_id: { $in: userCompanies }
			// });
			// const companyIds = test.map(company => company._id); // Extract _id from each company
			// companyId = companyIds;
		}

		// const test = await Company.find({
		// 	_id: { $in: user.companies }
		// });
		// console.log('test', test)
		console.log("entity:", entity);
		console.log("companyId:", companyId);
		const isRefreshToken = await UserRefreshToken.findOne({
			user: entity._id,
			company: { $in: companyId },
		});
		if (isRefreshToken) {
			await isRefreshToken.deleteOne();
		}
		const accessTokenPayload = {
			userId: user ? user._id : company.owner, // Use owner's _id if entity is company
			username: entity.username,
			ownerName: entity.name,
			ownerEmail: entity.email,
			ownerRole: entity.role,
			// companyId: companyId ? companyId : user.companies,
			companyId: companyId ? companyId : (user ? user.companies : null),
			name: entity.companyName || entity.name, // Use companyName if entity is company
			email: entity.email,
			role: entity.role,
			owner: entity.owner,
		};

		const accessToken = jwt.sign(
			accessTokenPayload,
			jwtSecret,
			{
				// expiresIn: '15m'
				expiresIn: '1d', // Shorter expiration for access token
			}
		);

		const refreshTokenPayload = {
			userId: user ? user._id : company.owner,
			username: entity.username,
			ownerName: entity.name,
			ownerEmail: entity.email,
			ownerRole: entity.role,
			companyId: companyId ? companyId : (user ? user.companies : null),
			name: entity.companyName || entity.name,
			email: entity.email,
			role: entity.role,
			owner: entity.owner,
		};

		const refreshToken = jwt.sign(
			refreshTokenPayload,
			jwtRefreshTokenSecret,
			{
				expiresIn: '7d', // Longer expiration for refresh token
			}
		);

		const newRefreshToken = new UserRefreshToken({
			refreshToken,
			// user: user ? user._id : null,
			user: user ? user._id : entity.owner,
			company: companyId ? companyId : user.companies,
		});
		await newRefreshToken.save();

		const oneDay = 1000 * 60 * 60 * 24 * 3;  // 3 hari dlm hitungan milisecond
		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			maxAge: new Date(Date.now() + oneDay),
			secure: process.env.MODE !== 'development', // Use secure cookies in production
			sameSite: 'strict', // Prevent CSRF attacks
			signed: true,
		});
		// req.session.userId = accessToken
		return {
			msg: `Good Job, Bos. Login Successfully. Welcome ${entity.companyName || entity.name} :)`,
			accessToken,
			refreshToken,
			companyId: companyId ? companyId : (user ? user.companies : null),
			entityName: entity.companyName || entity.name,
			entityEmail: entity.email,
			entityRole: entity.role,
			entityOwner: entity.owner,
			entityLogo: entity.logo,
			userId: user ? user._id : null,
			username: entity.username,
			userName: user ? user.name : null,
			userRole: user ? user.role : null,
			userEmail: user ? user.email : null,
			userCompanies: user ? user.companies : entity.owner,
			userAvatar: user ? user.avatar : null,
		}
	} catch (err) {
		throw err
	}
};

// const signinCompanies = async (req, res) => {
// 	try {
// 		const { email, password } = req.body;
// 		if (!email || !password) throw new BadRequestError("Please provide email and password");

// 		const user = await Users.findOne({
// 			// email,
// 			status: "Active",
// 		});
// 		if (!user) throw new UnauthorizedError("Access Denied!!! Invalid Credentials. Contact the Owner to Activated Your Account");
// 		console.log('user', user)
// 		const company = await Companies.findOne({
// 			email,
// 			status: "Active",
// 			owner: user._id
// 		});
// 		console.log('login cek company', company)
// 		if (!company) throw new UnauthorizedError("Invalid Credentials, Please Confirm Activate Account to your Owner");

// 		const isPassword = await company.comparePassword(password);
// 		if (!isPassword) throw new UnauthorizedError("Invalid Credentials. Access Denied!");

// 		const isRefreshToken = await UserRefreshToken.findOne({
// 			user: user._id,
// 			company: company._id,
// 		});
// 		if (isRefreshToken) {
// 			await isRefreshToken.deleteOne();
// 		}

// 		// const accessToken = createJWT({ payload: createTokenUser(user) });
// 		// const refreshToken = createRefreshJWT({ payload: createTokenUser(user) });
// 		const accessToken = jwt.sign(
// 			{
// 				userId: user._id,
// 				username: user.username,
// 				ownerName: user.name,
// 				ownerEmail: user.email,
// 				ownerRole: user.role,
// 				companyId: company._id,
// 				name: company.companyName,
// 				email: company.email,
// 				role: company.role,
// 				owner: company.owner,
// 			},
// 			jwtSecret,
// 			{
// 				expiresIn: '15m', // Shorter expiration for access token
// 			}
// 		);

// 		const refreshToken = jwt.sign(
// 			{
// 				userId: user._id,
// 				username: user.username,
// 				ownerName: user.name,
// 				ownerEmail: user.email,
// 				ownerRole: user.role,
// 				companyId: company._id,
// 				name: company.companyName,
// 				email: company.email,
// 				role: company.role,
// 				owner: company.owner,
// 			},
// 			jwtRefreshTokenSecret,
// 			{
// 				expiresIn: '7d', // Longer expiration for refresh token
// 			}
// 		);
// 		const newRefreshToken = new UserRefreshToken({
// 			refreshToken,
// 			user: user._id,
// 			company: company._id,
// 		});
// 		await newRefreshToken.save();

// 		const oneDay = 1000 * 60 * 60 * 24 * 3;  // 3 hari dlm hitungan milisecond
// 		res.cookie('refreshToken', refreshToken, {
// 			httpOnly: true,
// 			maxAge: new Date(Date.now() + oneDay),
// 			secure: process.env.MODE !== 'development', // Use secure cookies in production
// 			sameSite: 'strict', // Prevent CSRF attacks
// 			signed: true,
// 		});
// 		// req.session.userId = accessToken
// 		return {
// 			msg: `Good Job, Bos. Login Successfully. Welcome ${company.companyName} :)`,
// 			accessToken,
// 			refreshToken,
// 			companyId: company._id,
// 			name: company.companyName,
// 			email: company.email,
// 			role: company.role,
// 			owner: company.owner,
// 			logo: company.logo,
// 			userId: user._id,
// 			username: user.username,
// 			name: user.name,
// 			role: user.role,
// 			email: user.email,
// 			companies: user.companies,
// 			avatar: user.avatar,
// 		}
// 	} catch (err) {
// 		throw err
// 	}
// };

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
			status: "Active",
		},
		{ new: true }
	);
	// const token = createJWT({ payload: createTokenUser(users) });
	// attachCookiesToResponse({ res, users: token });
	// res.status(StatusCodes.CREATED).json({ users: token });

	delete users._doc._id;
	delete users._doc.password;
	delete users._doc.otp;
	delete users._doc.role;
	delete users._doc.status;

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
	if (newPassword !== confirmPassword) throw new BadRequestError("Password and Confirm Password do not match");

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
	if (newPassword !== confirmPassword) throw new BadRequestError("Password and Confirm Password do not match");

	const resetTokenFromDB = await UserRefreshToken.findOne().populate({
		path: 'user',
		select: '_id name email',
	});
	if (!resetTokenFromDB) throw new Error("Reset token not found in the database or does not match");

	// const payload = isTokenValidRefreshToken({ token: resetTokenFromDB.refreshToken });
	// const userCheck = await Users.findOne({ email: payload.email });
	const userCheck = await Users.findOne({ _id: req.user.userId });
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
	// signupUserWithCompanies,
	signinUser,
	signinCompanies,
	activateUser,
	getRefreshToken,
	logoutUser,
	requestPasswordReset,
	resetPassword,
	changePassword
};
