const {
	getAllCompanies,
	createCompany,
	getOneCompany,
	updateCompany,
	deleteCompany,
	changeStatusCompany,
} = require('../../../services/mongoose-v2/companies');
const { StatusCodes } = require('http-status-codes');

const index = async (req, res, next) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const size = parseInt(req.query.size) || 10;
		const search = req.query.search_query || "";
		const queryFields = ['companyName', '_id'];

		const result = await getAllCompanies(req, queryFields, search, page, size);
		res.status(StatusCodes.OK).json(result);
	} catch (err) {
		next(err);
	}
};

const create = async (req, res, next) => {
	console.log('token company controller', req.user)
	try {
		const { msg, data } = await createCompany(req);
		res.status(StatusCodes.CREATED).json({
			msg, data
		});
	} catch (err) {
		next(err);
	}
};

const find = async (req, res, next) => {
	try {
		const result = await getOneCompany(req);
		return res.status(StatusCodes.OK).json({
			data: result,
		});
	} catch (err) {
		next(err);
	}
};

const update = async (req, res, next) => {
	const { id } = req.params;
	try {
		const { msg, data } = await updateCompany(req, id, req.body);
		return res.status(StatusCodes.OK).json({
			msg, data,
		});
	} catch (err) {
		next(err);
	}
};
// const update = async (req, res, next) => {
// 	try {
// 		const { msg, data } = await updateCompany(req);
// 		return res.status(StatusCodes.OK).json({
// 			msg, data,
// 		});
// 	} catch (err) {
// 		next(err);
// 	}
// };

const destroy = async (req, res, next) => {
	const { id } = req.params;
	try {
		const { msg, data } = await deleteCompany(id, req);
		res.status(StatusCodes.OK).json({
			msg, data
		});
	} catch (err) {
		next(err);
	}
};

const changeStatus = async (req, res, next) => {
	try {
		const { msg, data } = await changeStatusCompany(req);
		res.status(StatusCodes.OK).json({
			msg, data
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
	changeStatus
};