const {
	getAllUsers,
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
		const { msg, data } = await deleteUser(req);
		res.status(StatusCodes.OK).json({
			msg, data
		});
	} catch (err) {
		next(err);
	}
};

const changeStatus = async (req, res, next) => {
	try {
		const { msg, data } = await changeStatusUser(req);
		res.status(StatusCodes.OK).json({
			msg, data
		});
	} catch (err) {
		next(err);
	}
};

const showCurrentUser = async (req, res) => {
	console.log('req', req.user)
	res.status(StatusCodes.OK).json({ user: req.user });
};

module.exports = {
	index,
	create,
	find,
	update,
	destroy,
	changeStatus,
	showCurrentUser,
};