const {
	getAllOrders,
	getAllOrders2,
	createOrder,
	getSingleOrder,
	updateOrder,
	deleteOrder,
} = require('../../../services/mongoose-v2/order');
const Order = require('./model');
const { StatusCodes } = require('http-status-codes');
// const { checkPermissions } = require('../utils');

const create = async (req, res, next) => {
	try {
		const { msg, data } = await createOrder(req);
		res.status(StatusCodes.CREATED).json({
			msg, data
		});
	} catch (err) {
		next(err);
	}
};

const index = async (req, res, next) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const size = parseInt(req.query.size) || 10;
		const search = req.query.search_query || "";
		const queryFields = ['status'];

		const result = await getAllOrders(req, queryFields, search, page, size);
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
		const queryFields = ['status'];

		// const filter = { company: req.user.company };

		// const result = await getAllSubCategories2(req, queryFields, search, page, size, filter);
		const result = await getAllOrders2(req, queryFields, search, page, size);
		res.status(StatusCodes.OK).json(result);
	} catch (err) {
		next(err);
	}
};

const find = async (req, res, next) => {
	try {
		const result = await getSingleOrder(req);
		return res.status(StatusCodes.OK).json({
			data: result,
		});
	} catch (err) {
		next(err);
	}
};

const getCurrentUserOrders = async (req, res) => {
	const orders = await Order.find({ user: req.user.userId });
	res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

const update = async (req, res, next) => {
	try {
		const { msg, data } = await updateOrder(req);
		return res.status(StatusCodes.OK).json({
			msg, data
		});
	} catch (err) {
		next(err);
	}
};

const destroy = async (req, res, next) => {
	try {
		const { msg } = await deleteOrder(req);
		res.status(StatusCodes.OK).json({
			msg
		});
	} catch (err) {
		next(err);
	}
};

module.exports = {
	index,
	indexInfinite,
	create,
	find,
	update,
	destroy,
	getCurrentUserOrders,
};