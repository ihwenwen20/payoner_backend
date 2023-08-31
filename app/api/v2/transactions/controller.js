const {
	getAllTransaction,
	getOneTransaction,
	updateTransaction,
	createTransaction,
	deleteTransaction,
	changestatusTransaction,
} = require('../../../services/mongoose-v2/transaction');

const {StatusCodes} = require('http-status-codes');

const create = async (req, res, next) => {
	try {
		const result = await createTransaction(req);

		res.status(StatusCodes.CREATED).json({
			data: result,
		});
	} catch (err) {
		next(err);
	}
};

const index = async (req, res, next) => {
	try {
		const result = await getAllTransaction(req);

		res.status(StatusCodes.OK).json({
			data: result,
		});
	} catch (err) {
		next(err);
	}
};

const find = async (req, res, next) => {
	try {
		const result = await getOneTransaction(req);

		res.status(StatusCodes.OK).json({
			data: result,
		});
	} catch (err) {
		next(err);
	}
};

const update = async (req, res, next) => {
	try {
		const result = await updateTransaction(req);

		res.status(StatusCodes.OK).json({
			data: result,
		});
	} catch (err) {
		next(err);
	}
};

const destroy = async (req, res, next) => {
	try {
		const result = await deleteTransaction(req);

		res.status(StatusCodes.OK).json({
			data: result,
		});
	} catch (err) {
		next(err);
	}
};

const changeStatus = async (req, res, next) => {
	try {
		const result = await changestatusTransaction(req);

		res.status(StatusCodes.OK).json({
			data: result,
		});
	} catch (err) {
		next(err);
	}
};

module.exports = {
	index,
	find,
	update,
	destroy,
	create,
	changeStatus,
};
