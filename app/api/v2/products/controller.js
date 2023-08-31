const {
	getAllProducts,
	getAllProducts2,
	createProduct,
	getOneProduct,
	updateProduct,
	deleteProduct,
} = require('../../../services/mongoose-v2/product');
const Images = require('../images/model');
const { StatusCodes } = require('http-status-codes');

const index = async (req, res, next) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const size = parseInt(req.query.size) || 10;
		const search = req.query.search_query || "";
		const queryFields = ['name', 'price', 'featured', 'freeShipping',
			'averageRating', 'numOfReviews'];

		const result = await getAllProducts(req, queryFields, search, page, size);
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
		// const queryFields = ['_id', 'name', 'price', 'featured', 'freeShipping',
		// 	'averageRating', 'numOfReviews'];
		const queryFields = ['_id'];
		const result = await getAllProducts(req, queryFields, search, page, size);
		res.status(StatusCodes.OK).json(result);
	} catch (err) {
		next(err);
	}
};

const create = async (req, res, next) => {
	try {
		const { msg, data } = await createProduct(req);
		res.status(StatusCodes.CREATED).json({
			msg, data
		});
	} catch (err) {
		next(err);
	}
};

const find = async (req, res, next) => {
	try {
		const result = await getOneProduct(req);
		return res.status(StatusCodes.OK).json({
			data: result,
		});
	} catch (err) {
		next(err);
	}
};

const update = async (req, res, next) => {
	try {
		const { msg, data } = await updateProduct(req);
		return res.status(StatusCodes.OK).json({
			msg, data,
		});
	} catch (err) {
		next(err);
	}
};

const destroy = async (req, res, next) => {
	try {
		const { msg, data } = await deleteProduct(req);
		res.status(StatusCodes.OK).json({
			msg, data
		});
	} catch (err) {
		next(err);
	}
};

const uploadImage = async (req, res, next) => {
	try {
		const result = await Images.create({
			url: req.file
				? `images/products/${req.file.filename}`
				: 'images/products/brosur.png',
		});
		res.status(StatusCodes.OK).json({ msg: "Success! Image Products Uploaded.", data: result });
	} catch (err) {
		next(err);
	}
};

module.exports = {
	index, indexInfinite,
	create,
	find,
	update,
	destroy,
	uploadImage,
};