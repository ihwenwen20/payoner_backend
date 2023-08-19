const {
	getAllPayments,
	getAllPayments2,
	createPayment,
	getOnePayment,
	updatePayment,
	deletePayment,
	changeStatusPayment,
} = require('../../../services/mongoose-v2/payments');
const { StatusCodes } = require('http-status-codes');

const index = async (req, res, next) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const size = parseInt(req.query.size) || 10;
		const search = req.query.search_query || "";
		const queryFields = ['status', 'type'];

		const result = await getAllPayments(req, queryFields, search, page, size);
		res.status(StatusCodes.OK).json(result);
	} catch (err) {
		next(err);
	}
};

const indexInfinite = async (req, res, next) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const size = parseInt(req.query.size) || 10;
		const search = req.query.search_query || "";
		const queryFields = ['status', 'type'];

		// const filter = { company: req.user.company };

		// const result = await getAllPayments2(req, queryFields, search, page, size, filter);
		const result = await getAllPayments2(req, queryFields, search, page, size);
		res.status(StatusCodes.OK).json(result);
	} catch (err) {
		next(err);
	}
};

const create = async (req, res, next) => {
	try {
		const { msg, data } = await createPayment(req);
		res.status(StatusCodes.CREATED).json({
			msg, data,
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
		const { msg, data } = await updatePayment(req);
		res.status(StatusCodes.OK).json({
			msg, data,
		});
	} catch (err) {
		next(err);
	}
};

const destroy = async (req, res, next) => {
	try {
		const { msg } = await deletePayment(req);
		res.status(StatusCodes.OK).json({
			msg
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
	indexInfinite,
	find,
	update,
	destroy,
	create,
	changeStatus
};
