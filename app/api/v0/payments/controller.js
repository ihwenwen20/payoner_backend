const { StatusCodes } = require('http-status-codes');

const {
	getAllPayments,
	createPayment,
	getOnePayment,
	updatePayment,
	deletePayment,
	changeStatusPayment,
} = require('../../../services/mongoose/payments');

const index = async (req, res, next) => {
	try {
		const result = await getAllPayments(req);

		res.status(StatusCodes.OK).json({
			data: result,
		});
	} catch (err) {
		next(err);
	}
};

const create = async (req, res, next) => {
	try {
		const result = await createPayment(req);

		res.status(StatusCodes.CREATED).json({
			data: result,
		});
	} catch (err) {
		next(err);
	}
};

const find = async (req, res, next) => {
	try {
		const result = await getOnePayment(req);

		res.status(StatusCodes.OK).json({
			data: result,
		});
	} catch (err) {
		next(err);
	}
};

const update = async (req, res, next) => {
	try {
		const result = await updatePayment(req);

		res.status(StatusCodes.OK).json({
			data: result,
		});
	} catch (err) {
		next(err);
	}
};

const destroy = async (req, res, next) => {
	try {
		const result = await deletePayment(req);
		res.status(StatusCodes.OK).json({
			data: result,
		});
	} catch (err) {
		next(err);
	}
};

const changeStatus = async (req, res, next) => {
	try {
		const result = await changeStatusPayment(req);

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
	changeStatus
};
