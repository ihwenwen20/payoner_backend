const {
	getAllUsers,
	getAllUsers2,
	createUser,
	getDetailUser,
	updateUser,
	deleteUser,
	changeStatusUser,
} = require('../../../services/mongoose-v2/users');
const { StatusCodes } = require('http-status-codes');

const index = async (req, res, next) => {
	try {
		let page = parseInt(req.query.page) || 1;
		const size = parseInt(req.query.size) || 10;
		const search = req.query.search_query || "";
		const queryFields = ['username', 'name', 'email', 'status'];

		const result = await getAllUsers(req, queryFields, search, page, size);
		res.status(StatusCodes.OK).json(result);
	} catch (err) {
		next(err);
	}
};

const indexInfinite = async (req, res, next) => {
	try {
		let page = parseInt(req.query.page) || 1;
		const size = parseInt(req.query.size) || 10;
		const search = req.query.search_query || "";
		const queryFields = ['username', 'name', 'email', 'status'];

		// const filter = { company: req.user.company };

		// const result = await getAllUsers2(req, queryFields, search, page, size, filter);

		const result = await getAllUsers2(req, queryFields, search, page, size);
		res.status(StatusCodes.OK).json(result);
	} catch (err) {
		next(err);
	}
};

const create = async (req, res, next) => {
	try {
		const { msg, data } = await createUser(req);
		res.status(StatusCodes.CREATED).json({
			msg, data
		});
	} catch (err) {
		next(err);
	}
};

const find = async (req, res, next) => {
	try {
		const result = await getDetailUser(req);

		res.status(StatusCodes.OK).json({
			data: result,
		});
	} catch (err) {
		next(err);
	}
};

const update = async (req, res, next) => {
	try {
		const { msg, data } = await updateUser(req);
		res.status(StatusCodes.OK).json({
			msg, data
		});
	} catch (err) {
		next(err);
	}
};

const destroy = async (req, res, next) => {
	try {
		const { msg } = await deleteUser(req);
		res.status(StatusCodes.OK).json({
			msg
		});
	} catch (err) {
		next(err);
	}
};

const changeStatus = async (req, res, next) => {
	try {
		const result = await changeStatusUser(req);
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
	create,
	find,
	update,
	destroy,
	changeStatus,
};