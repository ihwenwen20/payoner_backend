const {
	getAllCustomers,
	getAllCustomers2,
	createCustomer,
	getDetailCustomer,
	updateCustomer,
	deleteCustomer,
} = require('../../../services/mongoose-v2/customers');
const { StatusCodes } = require('http-status-codes');

const index = async (req, res, next) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const size = parseInt(req.query.size) || 10;
		const search = req.query.search_query || "";
		const queryFields = ['name'];

		const result = await getAllCustomers(req, queryFields, search, page, size);
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
		const queryFields = ['name'];

		// const filter = { company: req.user.company };

		// const result = await getAllCustomers2(req, queryFields, search, page, size, filter);
		const result = await getAllCustomers2(req, queryFields, search, page, size);
		res.status(StatusCodes.OK).json(result);
	} catch (err) {
		next(err);
	}
};

const create = async (req, res, next) => {
	try {
		const { msg, data } = await createCustomer(req);
		res.status(StatusCodes.CREATED).json({
			msg, data
		});
	} catch (err) {
		next(err);
	}
};

const find = async (req, res, next) => {
	try {
		const result = await getDetailCustomer(req);
		return res.status(StatusCodes.OK).json({
			data: result,
		});
	} catch (err) {
		next(err);
	}
};

const update = async (req, res, next) => {
	try {
		const { msg, data } = await updateCustomer(req);
		return res.status(StatusCodes.OK).json({
			msg, data
		});
	} catch (err) {
		next(err);
	}
};

const destroy = async (req, res, next) => {
	try {
		const { msg } = await deleteCustomer(req);
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
};