const { signinUser, signupUser, logoutUser, activateUser, getRefreshToken } = require('../../../services/mongoose-v2/auth');
const { StatusCodes } = require('http-status-codes');

const register = async (req, res, next) => {
	try {
		const { msg, data } = await signupUser(req, res);
		res.status(StatusCodes.CREATED).json({
			msg, data
		});
	} catch (err) {
		next(err);
	}
};

const login = async (req, res, next) => {
	try {
		const {
			accessToken,
			refreshToken,
			name,
			email,
			role,
			avatar } = await signinUser(req, res);

		res.status(StatusCodes.CREATED).json({
			accessToken,
			refreshToken,
			name,
			email,
			role,
			avatar
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
		const { accessToken, refreshtoken } = await getRefreshToken(req);

		res.status(StatusCodes.OK).json({
			accessToken, refreshtoken
		});
	} catch (err) {
		next(err);
	}
};

const logout = async (req, res, next) => {
	try {
		const result = await logoutUser(req, res);
		res.status(StatusCodes.OK).json({
			data: result,
			msg: 'Logout Success!',
		});
	} catch (err) {
		next(err);
	}
};

module.exports = { login, register, showMe, activeUser, logout };
