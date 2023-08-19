const {
	getAllAddresses,
	getAllAddresses2,
	createAddress,
	getDetailAddress,
	updateAddress,
	deleteAddress,
} = require('../../../services/mongoose-v2/address');
const { StatusCodes } = require('http-status-codes');

const index = async (req, res, next) => {
	try {
		let page = parseInt(req.query.page) || 1;
		const size = parseInt(req.query.size) || 10;
		const search = req.query.search_query || "";
		const queryFields = ['address', 'desa', 'kecamatan', 'city', 'zipcode', 'province', 'country'];

		const result = await getAllAddresses(req, queryFields, search, page, size);
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
		const queryFields = ['address', 'desa', 'kecamatan', 'city', 'zipcode', 'province', 'country'];

		// const filter = { company: req.user.company };

		// const result = await getAllAddresses2(req, queryFields, search, page, size, filter);
		const result = await getAllAddresses2(req, queryFields, search, page, size);
		res.status(StatusCodes.OK).json(result);
	} catch (err) {
		next(err);
	}
};

const create = async (req, res, next) => {
	try {
		const { msg, data } = await createAddress(req);
		res.status(StatusCodes.CREATED).json({
			msg, data
		});
	} catch (err) {
		next(err);
	}
};

const find = async (req, res, next) => {
	try {
		const result = await getDetailAddress(req);

		return res.status(StatusCodes.OK).json({
			data: result,
		});
	} catch (err) {
		next(err);
	}
};

const update = async (req, res, next) => {
	try {
		const { msg, data } = await updateAddress(req);
		return res.status(StatusCodes.OK).json({
			msg, data
		});
	} catch (err) {
		next(err);
	}
};

const destroy = async (req, res, next) => {
	try {
		const { msg, data } = await deleteAddress(req);
		res.status(StatusCodes.OK).json({
			msg, data
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
