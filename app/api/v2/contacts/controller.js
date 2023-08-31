const {
	getAllContacts,
	createContact,
	getOneContact,
	updateContact,
	deleteContact,
} = require('../../../services/mongoose-v2/contact');
const { StatusCodes } = require('http-status-codes');

const index = async (req, res, next) => {
	// console.log('user', req.user)
	try {
		const page = parseInt(req.query.page) || 1;
		const size = parseInt(req.query.size) || 10;
		const search = req.query.search_query || "";
		const queryFields = ['name', 'email', 'phone', 'blockir'];

		const result = await getAllContacts(req, queryFields, search, page, size);
		res.status(StatusCodes.OK).json(result);
	} catch (err) {
		next(err);
	}
};

const create = async (req, res, next) => {
	try {
		const { msg, data } = await createContact(req);
		res.status(StatusCodes.CREATED).json({
			msg, data
		});
	} catch (err) {
		next(err);
	}
};

const find = async (req, res, next) => {
	try {
		const result = await getOneContact(req);
		res.status(StatusCodes.OK).json({
			data: result,
		});
	} catch (err) {
		next(err);
	}
};

// const update = async (req, res, next) => {
// 	try {
// 		const { msg, data } = await updateContact(req);
// 		res.status(StatusCodes.OK).json({
// 			msg, data
// 		});
// 	} catch (err) {
// 		next(err);
// 	}
// };

const update = async (req, res, next) => {
	const { id } = req.params;
	try {
		const { msg, data } = await updateContact(id, req.body);
		res.status(StatusCodes.OK).json({
			msg, data
		});
	} catch (err) {
		next(err);
	}
};

const destroy = async (req, res, next) => {
	try {
		const { msg, data } = await deleteContact(req);
		res.status(StatusCodes.OK).json({
			msg, data
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

