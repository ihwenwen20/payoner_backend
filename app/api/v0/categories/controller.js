// import services categories sebagai pengganti import model category sebelumnya
const {
	getAllCategories,
	createCategories,
	getOneCategories,
	updateCategories,
	deleteCategories,
} = require('../../../services/mongoose-v2/categories');
const { StatusCodes } = require('http-status-codes');
const { infiniteScrollData } = require('../../../utils/paginationUtils'); // Sesuaikan dengan lokasi utilitas Anda
const Categories = require('../../v1/categories/model');

// Fix Infinite
// const indexInfinite = async (req, res, next) => {
// 	try {
// 		let page = parseInt(req.query.page) || 1;
// 		const size = parseInt(req.query.size) || 10;
// 		const search = req.query.search_query || "";

// 		if (search) {
// 			// Jika terdapat parameter pencarian, atur halaman kembali ke 1
// 			page = 1;
// 		}

// 		const skip = (page - 1) * size;

// 		const query = {};
// 		if (search) {
// 			query.name = { $regex: search, $options: "i" };
// 		}

// 		const totalRows = await Categories.countDocuments(query);
// 		const totalPage = Math.ceil(totalRows / size);
// 		const result = await Categories.find(query).skip(skip).limit(size);
// 		res.status(StatusCodes.OK).json({
// 			data: result,
// 			totalRows,
// 			page,
// 			size,
// 			totalPage,
// 			search
// 		});
// 	} catch (err) {
// 		next(err);
// 	}
// };

const index = async (req, res, next) => {
	try {
		const result = await getAllCategories(req);
		res.status(StatusCodes.OK).json({
			data: result,
		});
	} catch (err) {
		next(err);
	}
};

// const indexInfinite = async (req, res, next) => {
// 	try {
// 		const {
// 			data,
// 			totalRows,
// 			page,
// 			size,
// 			search
// 		} = await getAllCategories(req);
// 		res.status(StatusCodes.OK).json({
// 			data,
// 			totalRows,
// 			page,
// 			size,
// 			search
// 		});
// 	} catch (err) {
// 		next(err);
// 	}
// };

const indexInfinite = async (req, res, next) => {
	try {
		let page = parseInt(req.query.page) || 1;
		const size = parseInt(req.query.size) || 10;
		const search = req.query.search_query || "";

		if (search) {
			page = 1;
		}

		const result = await getAllCategories(req, search, page, size);
		res.status(StatusCodes.OK).json(result);
	} catch (err) {
		next(err);
	}
};


const create = async (req, res, next) => {
	try {
		const result = await createCategories(req);
		res.status(StatusCodes.CREATED).json({
			data: result,
		});
	} catch (err) {
		next(err);
	}
};

const find = async (req, res, next) => {
	try {
		const result = await getOneCategories(req);

		return res.status(StatusCodes.OK).json({
			data: result,
		});
	} catch (err) {
		next(err);
	}
};

const update = async (req, res, next) => {
	try {
		const result = await updateCategories(req);
		return res.status(StatusCodes.OK).json({
			data: result,
		});
	} catch (err) {
		next(err);
	}
};

const destroy = async (req, res, next) => {
	try {
		const result = await deleteCategories(req);
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
};