const { StatusCodes } = require('http-status-codes');
const {
	getAllCoverages,
	createCoverage,
	getOneCoverage,
	updateCoverage,
	deleteCoverage,
} = require('../../../services/mongoose/coverage');


const index = async (req, res, next) => {
	try {
		const result = await getAllCoverages(req);
		res.status(StatusCodes.OK).json({
			data: result,
		});
	} catch (err) {
		next(err);
	}
};

const create = async (req, res, next) => {
	try {
		const result = await createCoverage(req);
		res.status(StatusCodes.CREATED).json({
			data: result,
		});
	} catch (err) {
		next(err);
	}
};

const find = async (req, res, next) => {
	try {
		const { id } = req.params;
		const result = await getOneCoverage(id);
		return res.status(StatusCodes.OK).json({
			data: result,
		});
	} catch (err) {
		next(err);
	}
};

const update = async (req, res, next) => {
	try {
    const { id } = req.params;
		const result = await updateCoverage(id, req.body);
		return res.status(StatusCodes.OK).json({
			data: result,
		});
	} catch (err) {
		next(err);
	}
};

const destroy = async (req, res, next) => {
	try {
    const { id } = req.params;
		const result = await deleteCoverage(id);
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
};