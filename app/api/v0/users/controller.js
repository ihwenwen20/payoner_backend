const {
	getAllCompanies,
	createCompany,
	changeStatusCompanies,
	getDetailsCompany,
	updateCompany,
	deleteCompany,
} = require('../../../services/mongoose/users');

const {StatusCodes} = require('http-status-codes');

const getCMSCompanies = async (req, res, next) => {
	try {
		const result = await getAllCompanies(req);
		res.status(StatusCodes.OK).json({
			data: result,
		});
	} catch (err) {
		next(err);
	}
};

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

const changeStatus = async (req, res, next) => {
	try {
		const result = await changeStatusCompanies(req);

		res.status(StatusCodes.OK).json({
			data: result,
		});
	} catch (err) {
		next(err);
	}
};

const find = async (req, res, next) => {
	try {
		const result = await getDetailsCompany(req);

		res.status(StatusCodes.OK).json({
			data: result,
		});
	} catch (err) {
		next(err);
	}
};

const update = async (req, res, next) => {
	try {
		const result = await updateCompany(req);

		res.status(StatusCodes.OK).json({
			data: result,
		});
	} catch (err) {
		next(err);
	}
};

const destroy = async (req, res, next) => {
	try {
		const result = await deleteCompany(req);

		res.status(StatusCodes.OK).json({
			data: result,
		});
	} catch (err) {
		next(err);
	}
};



module.exports = {
	getCMSCompanies,
	createCMSCompany,
	changeStatus,
	find,
	update,
	destroy,
};