// import services categories sebagai pengganti import model category sebelumnya
const {StatusCodes} = require('http-status-codes');
const {
	getAllCategories,
	createCategories,
	getOneCategories,
	updateCategories,
	deleteCategories,
} = require('../../../services/mongoose/categories');


const index = async (req, res, next) => {
	try {
		const result = await getAllCategories(req);
		res.status(StatusCodes.OK).json({
			data: result,
		});
	} catch (err) {
		next(err);
	}
};

const create = async (req, res, next) => {
	try {
		const result = await createCategories(req);
		res.status(StatusCodes.CREATED).json({
			data: result,
		});
	} catch (err) {
		next(err);
	}
};

const find = async (req, res, next) => {
	try {
		const result = await getOneCategories(req);

		return res.status(StatusCodes.OK).json({
			data: result,
		});
	} catch (err) {
		next(err);
	}
};

const update = async (req, res, next) => {
	try {
		const result = await updateCategories(req);
		return res.status(StatusCodes.OK).json({
			data: result,
		});
	} catch (err) {
		next(err);
	}
};

const destroy = async (req, res, next) => {
	try {
		const result = await deleteCategories(req);
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