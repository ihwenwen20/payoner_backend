const {StatusCodes} = require('http-status-codes');

const {
	createCompany,
	createUsers,
	getAllUsers,
} = require('../../../services/mongoose/users');

const createCMSCompany = async (req, res, next) => {
	try {
		const result = await createCompany(req);

		res.status(StatusCodes.CREATED).json({
			data: result,
		});
	} catch (err) {
		next(err);
	}
};

const getCMSUsers = async (req, res, next) => {
	try {
		const result = await getAllUsers(req);
		res.status(StatusCodes.OK).json({
			data: result,
		});
	} catch (err) {
		next(err);
	}
};

const createCMSUser = async (req, res, next) => {
	try {
		const result = await createUsers(req);

		res.status(StatusCodes.CREATED).json({
			data: result,
		});
	} catch (err) {
		next(err);
	}
};
module.exports = {
	createCMSCompany,
	getCMSUsers,
	createCMSUser,
};
