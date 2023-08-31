const {
	getAllCoverages,
	createCoverage,
	getOneCoverage,
	updateCoverage,
	deleteCoverage,
	changeStatusArea,
} = require('../../../services/mongoose-v2/coverage');
const { StatusCodes } = require('http-status-codes');


const index = async (req, res, next) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const size = parseInt(req.query.size) || 10;
		const search = req.query.search_query || "";
		const queryFields = ['areaName', 'codeArea', 'status'];

		const result = await getAllCoverages(req, queryFields, search, page, size);
		res.status(StatusCodes.OK).json(result);
	} catch (err) {
		next(err);
	}
};

const create = async (req, res, next) => {
	try {
		const { msg, data } = await createCoverage(req, res);
		res.status(StatusCodes.CREATED).json({
			msg, data
		});
	} catch (err) {
		next(err);
	}
};

const find = async (req, res, next) => {
	try {
		const result = await getOneCoverage(req);
		return res.status(StatusCodes.OK).json({
			result
		});
	} catch (err) {
		next(err);
	}
};

const update = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { msg, data } = await updateCoverage(id, req.body);
		return res.status(StatusCodes.OK).json({
			msg, data
		});
	} catch (err) {
		next(err);
	}
};

const destroy = async (req, res, next) => {
	try {
		const { msg, data } = await deleteCoverage(req);
		res.status(StatusCodes.OK).json({
			msg, data
		});
	} catch (err) {
		next(err);
	}
};

const changeStatus = async (req, res, next) => {
	try {
		const { msg, data } = await changeStatusArea(req);
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