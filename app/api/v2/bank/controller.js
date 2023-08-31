const {
	getAllBanks,
	createBank,
	getOneBank,
	updateBank,
	deleteBank,
} = require('../../../services/mongoose-v2/bank');
const { StatusCodes } = require('http-status-codes');

const index = async (req, res, next) => {
	try {
		let page = parseInt(req.query.page) || 1;
		const size = parseInt(req.query.size) || 10;
		const search = req.query.search_query || "";
		const queryFields = ['ownerName', 'bankName', 'noRekening'];

		const result = await getAllBanks(req, queryFields, search, page, size);
		res.status(StatusCodes.OK).json(result);
	} catch (err) {
		next(err);
	}
};

const create = async (req, res, next) => {
	try {
		const { msg, data } = await createBank(req);
		res.status(StatusCodes.CREATED).json({
			msg, data
		});
	} catch (err) {
		next(err);
	}
};

const find = async (req, res, next) => {
	try {
		const result = await getOneBank(req);
		return res.status(StatusCodes.OK).json({
			data: result,
		});
	} catch (err) {
		next(err);
	}
};

const update = async (req, res, next) => {
	const { id } = req.params;
	try {
		const { msg, data } = await updateBank(req, id, req.body);
		return res.status(StatusCodes.OK).json({
			msg, data
		});
	} catch (err) {
		next(err);
	}
};

const destroy = async (req, res, next) => {
	try {
		const { msg, data } = await deleteBank(req);
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