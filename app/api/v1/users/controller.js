const {
	getAllCompanies,
	createCompany,
	getDetailsCompany,
	updateCompany,
	deleteCompany,
	changeStatusCompanies,
} = require('../../../services/mongoose/users');

const { StatusCodes } = require('http-status-codes');

const index = async (req, res, next) => {
	try {
		const result = await getAllCompanies(req);
		res.status(StatusCodes.OK).json({
			data: result,
		});
	} catch (err) {
		next(err);
	}
};

const create = async (req, res, next) => {
	try {
		const result = await createCompany(req);

		res.status(StatusCodes.CREATED).json({
			result,
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

module.exports = {
	index,
	create,
	find,
	update,
	destroy,
	changeStatus,
};