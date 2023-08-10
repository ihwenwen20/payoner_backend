const { signinUser, signupUser, logout, activateUser } = require('../../../services/mongoose/auth');

const { StatusCodes } = require('http-status-codes');

const signinCms = async (req, res, next) => {
	try {
		const result = await signinUser(req);

		res.status(StatusCodes.CREATED).json({
			data: result,
		});
	} catch (err) {
		next(err);
	}
};

const signupCms = async (req, res, next) => {
	try {
		const result = await signupUser(req);

		res.status(StatusCodes.CREATED).json({
			// status: 'Success',
			// msg: 'Please Activated Account with OTP Code from your email',
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

// const logout = async (req, res, next) => {
// 	try {
// 		const result = await activateUser(req);

// 		res.status(StatusCodes.OK).json({
// 			data: {email: result.email},
// 		});
// 	} catch (err) {
// 		next(err);
// 	}
// };

module.exports = { signinCms, signupCms, activeUser};
