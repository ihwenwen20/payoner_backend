const {
	getAllUsers,
	createUser,
	getDetailUser,
	updateUser,
	deleteUser,
	changeStatusUser,
} = require('../../../services/mongoose-v2/users');
const { StatusCodes } = require('http-status-codes');
const { infiniteScrollData } = require('../../../utils/paginationUtils'); // Sesuaikan dengan lokasi utilitas Anda
const Users = require('../../v1/users/model'); // Sesuaikan dengan model yang Anda gunakan

const index = async (req, res, next) => {
	try {
			const page = parseInt(req.query.page) || 0;
			const limit = parseInt(req.query.limit) || 10;
			const search = req.query.search_query || "";

			const usersData = await getAllUsers(req, page, limit, search);
			res.status(StatusCodes.OK).json(usersData);
	} catch (err) {
			next(err);
	}
};

const create = async (req, res, next) => {
	try {
		const result = await createUser(req);

		res.status(StatusCodes.CREATED).json({
			data: result,
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
		const result = await updateUser(req);

		res.status(StatusCodes.OK).json({
			data: result,
		});
	} catch (err) {
		next(err);
	}
};

const destroy = async (req, res, next) => {
	try {
		const result = await deleteUser(req);

		res.status(StatusCodes.OK).json({
			data: result,
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
	create,
	find,
	update,
	destroy,
	changeStatus,
};