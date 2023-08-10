// import services Bank sebagai pengganti import model category sebelumnya
const { StatusCodes } = require('http-status-codes');
const {
	getAllBanks,
	createBank,
	getOneBank,
	updateBank,
	deleteBank,
} = require('../../../services/mongoose/Bank');


const index = async (req, res, next) => {
	try {
		const result = await getAllBanks(req);
		res.status(StatusCodes.OK).json({
			data: result,
		});
	} catch (err) {
		next(err);
	}
};

const create = async (req, res, next) => {
	try {
		const result = await createBank(req);
		res.status(StatusCodes.CREATED).json({
			data: result,
		});
	} catch (err) {
		next(err);
	}
};

const find = async (req, res, next) => {
	try {
		const result = await getOneBank(req);

		return res.status(StatusCodes.OK).json({
			data: result,
		});
	} catch (err) {
		next(err);
	}
};

const update = async (req, res, next) => {
	try {
		const result = await updateBank(req);
		return res.status(StatusCodes.OK).json({
			data: result,
		});
	} catch (err) {
		next(err);
	}
};

const destroy = async (req, res, next) => {
	try {
		const result = await deleteBank(req);
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