const { signinUser, signupUser, logoutUser, activateUser, getRefreshToken } = require('../../../services/mongoose/auth');
const { StatusCodes } = require('http-status-codes');

const register = async (req, res, next) => {
	try {
		const result = await signupUser(req, res);
		res.status(StatusCodes.CREATED).json({
			data: result,
			msg: 'Please Activated Account with OTP Code from your email',
		});
	} catch (err) {
		next(err);
	}
};

const login = async (req, res, next) => {
	try {
		const result = await signinUser(req, res);

		res.status(StatusCodes.CREATED).json({
			data: result,
		});
	} catch (err) {
		next(err);
	}
};


const activeUser = async (req, res, next) => {
	try {
		const result = await activateUser(req);

		res.status(StatusCodes.OK).json({
			data: result,
		});
	} catch (err) {
		next(err);
	}
};

const showMe = async (req, res, next) => {
	try {
		const result = await getRefreshToken(req);

		res.status(StatusCodes.OK).json({
			data: result,
		});
	} catch (err) {
		next(err);
	}
};

const logout = async (req, res, next) => {
	try {
		const result = await logoutUser(req,res);
		res.status(StatusCodes.OK).json({
			data: result,
			msg: 'Logout Success!',
		});
	} catch (err) {
		next(err);
	}
};

module.exports = { login, register, showMe, activeUser, logout };
