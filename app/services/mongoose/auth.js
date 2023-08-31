const Users = require("../../api/v1/users/model");
const Companies = require("../../api/v1/companies/model");
const Contact = require('../../api/v1/contacts/model');
const UserRefreshToken = require('../../api/v1/userRefreshToken/model');
const { NotFoundError, BadRequestError, UnauthorizedError } = require("../../errors");
const { generateToken, createJWT, createRefreshJWT, attachCookiesToResponse,isTokenValidRefreshToken } = require("../../utils/jwt");
const { createTokenUser, } = require("../../utils/createTokenUser");
const { otpMail } = require('../mail');
const { createUserRefreshToken } = require("./refreshToken");
const { createImages } = require('./images');

// const signupUser = async (req, res) => {
// 	const { company, email, password, confirmPassword, name } = req.body;
// 	if (!name || !company || !email || !password || !confirmPassword) {
// 		throw new BadRequestError("Please provide all required fields");
// 	}
// 	if (password !== confirmPassword) throw new BadRequestError("Password and Confirm Password do not match");

// 	const existingUser = await Users.findOne({ email });
// 	if (existingUser) {
// 		throw new BadRequestError("User with this email already exists");
// 	}

// 	try {
// 		// first registered Users is an owner
// 		const isFirstAccount = (await Users.countDocuments({})) === 0;
// 		const role = isFirstAccount ? 'owner' : 'admin';
// 		const companies = await Companies.create({ company });
// 		const user = await Users.create({
// 			name, email, password, role,
// 			company: companies._id,
// 			// otp: Math.floor(Math.random() * 9999)
// 		});

// 		// let checkMail = await Users.findOne({
// 		// 	email,
// 		// 	status: "tidak aktif",
// 		// });
// 		// await otpMail(email, checkMail);

// 		// Generate token
// 		// if (user) {
// 		// 	generateToken(res, user._id);
// 		// }

// 		return {
// 			msg: 'Please Activated Account with OTP Code from your email',
// 			user,
// 		}
// 	} catch (err) {
// 		console.log(err)
// 	}
// };

const signupUser = async (req, res) => {
	const { companyName, email, password, confirmPassword, name, phone, } = req.body;
	if (!name || !companyName || !email || !password || !confirmPassword) {
		throw new BadRequestError("Please provide all required fields");
	}
	if (password !== confirmPassword) throw new BadRequestError("Password and Confirm Password do not match");

	const existingUser = await Users.findOne({ email });
	if (existingUser) throw new BadRequestError(`User with this email: ${email} already exists`);

	try {
		// first registered Users is an owner
		const isFirstAccount = (await Users.countDocuments({})) === 0;
		const role = isFirstAccount ? 'owner' : 'admin';
		const status = isFirstAccount ? 'active' : 'pending';
		const avatar = await createImages(req);
		const companies = await Companies.create({ companyName });
		const contact = await Contact.create({ name, email, phone });
		const user = await Users.create({
			name, email, password, role, status,
			avatar: avatar._id,
			company: companies._id,
			contact: contact._id,
			// otp: Math.floor(Math.random() * 9999)
		});

		let checkMail = await Users.findOne({
			email,
			status: "tidak aktif",
		});
		await otpMail(email, checkMail);

		// Generate token
		// if (user) {
		// 	generateToken(res, user._id);
		// }
		const result = createTokenUser(user);
		attachCookiesToResponse({ res, user: result });
		return;
		// return {
		// 	msg: 'Please Activated Account with OTP Code from your email',
		// 	user,
		// 	result
		// }
	} catch (err) {
		console.log(err)
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
		// return;
		req.session.userId = accessToken
		return {
			accessToken,
			refreshToken,
			name: user.name,
			email: user.email,
			role: user.role,
			avatar: user.avatar,
		}
		// return result
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
			status: "aktif",
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

	const token = createJWT({ payload: createTokenUser(userCheck) });

	const newrefreshToken = createRefreshJWT({ payload: createTokenUser(result) });
	await createUserRefreshToken({
		refreshToken,
		user: result._id,
	});

	// return result;
	return {token, refreshtoken: newrefreshToken};
};

const logoutUser = async (req, res) => {
	res.clearCookie('refreshToken');
	req.session.destroy((err) => {
		if (err) console.error("Deleted Sessions Failed:", err);

		console.log({ msg: 'Logout Success!' });
	});
};

module.exports = {
	signupUser,
	signinUser,
	activateUser,
	getRefreshToken,
	logoutUser
};
