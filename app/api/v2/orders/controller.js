const {
	getAllOrders,
	getAllOrders2,
	createOrder,
	getSingleOrder,
	updateOrder,
	deleteOrder,
	accountingBalance,
	changeStatusOrder
} = require('../../../services/mongoose-v2/order');
const Order = require('./model');
const { StatusCodes } = require('http-status-codes');
// const { checkPermissions } = require('../utils');
const Orders= require('./model')

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
		const { msg, data } = await deleteOrder(req);
		res.status(StatusCodes.OK).json({
			msg, data
		});
	} catch (err) {
		next(err);
	}
};

const balance = async (req, res, next) => {
	try {
		const { msg, data } = await accountingBalance(req);
		res.status(StatusCodes.OK).json({
			msg, data
		});
	} catch (err) {
		next(err);
	}
};

const changeStatus = async (req, res, next) => {
	try {
		const { msg, data } = await changeStatusOrder(req);
		res.status(StatusCodes.OK).json({
			msg, data
		});
	} catch (err) {
		next(err);
	}
};

const getOrdersById = (req, res, next, id) => {
  Orders.findById(id).exec((error, cate) => {
    if (error || !cate) {
      return res.status(400).json({
        error: "No Category found in the DB",
      });
    }

    req.orders = cate;
    next();
  });
};

const getOrder = (req, res) => {
  return res.json(req.orders);
};

module.exports = {
	index,
	indexInfinite,
	create,
	find,
	update,
	destroy,
	getCurrentUserOrders,
	balance,
	changeStatus,getOrdersById,getOrder
};