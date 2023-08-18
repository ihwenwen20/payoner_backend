const Categories = require('../../api/v2/categories/model');
const { NotFoundError, BadRequestError, DuplicateError } = require('../../errors');
const { paginateData, infiniteScrollData } = require('../../utils/paginationUtils'); // Sesuaikan dengan lokasi utilitas Anda

// Cara 1
// const getAllCategories = async (req) => {
// 	// const result = await Categories.find({ company: req.user.company });
// 	// const result = await Categories.find({});

// 	let page = parseInt(req.query.page) || 1;
// 	const size = parseInt(req.query.size) || 10;
// 	const search = req.query.search_query || "";

// 	if (search) {
// 		// Jika terdapat parameter pencarian, atur halaman kembali ke 1
// 		page = 1;
// 	}

// 	const skip = (page - 1) * size;

// 	const query = {};
// 	if (search) {
// 		query.name = { $regex: search, $options: "i" };
// 	}

// 	const totalRows = await Categories.countDocuments(query);
// 	const result = await Categories.find(query).skip(skip).limit(size);

// 	const response = {
// 		data: result,
// 		totalRows,
// 		page,
// 		size,
// 		search
// 	};

// 	return response;
// 	// return result;
// };

// Cara 2
// const getAllCategories = async (search, page, size) => {
// 	let query = {};
// 	if (search) {
// 			query.name = { $regex: search, $options: "i" };
// 	}

// 	const totalRows = await Categories.countDocuments(query);
// 	const totalPage = Math.ceil(totalRows / size);
// 	const skip = (page - 1) * size;
// 	const result = await Categories.find(query).skip(skip).limit(size);

// 	return {
// 			data: result,
// 			totalRows,
// 			page,
// 			size,
// 			totalPage,
// 			search
// 	};
// };


// Cara 3
const getAllCategories = async (req, queryFields, search, page, size, filter) => {
	const result = await paginateData(Categories, queryFields, search, page, size, filter);
	return result;
};

const getAllCategories2 = async (req, queryFields, search, page, size, filter) => {
	const result = await infiniteScrollData(Categories, queryFields, search, page, size, filter);
	return result;
};

const createCategories = async (req) => {
	const { name } = req.body;

	// cari categories dengan field name
	const check = await Categories.findOne({
		name,
		// company: req.user.company,
	});

	// apa bila check true / data categories sudah ada maka kita tampilkan error bad request dengan message Duplicate Category Name
	if (check) throw new DuplicateError(name);

	try {
		const result = await Categories.create({
			name,
			// company: req.user.company,
		});

		return result;
	} catch (err) {
		throw err
	}
};

const getOneCategories = async (req) => {
	const { id } = req.params;

	const result = await Categories.findOne({
		_id: id,
		// company: req.user.company,
	});

	if (!result) throw new NotFoundError(`No Category with id :  ${id}`);

	return result;
};

const updateCategories = async (req) => {
	const { id } = req.params;
	const { name } = req.body;

	// cari categories dengan field name dan id selain dari yang dikirim dari params
	const check = await Categories.findOne({
		name,
		// company: req.user.company,
		_id: { $ne: id },
	});

	// apa bila check true / data categories sudah ada maka kita tampilkan error bad request dengan message Duplicate Category Name
	if (check) throw new BadRequestError('Duplicate Category Name');

	const result = await Categories.findOneAndUpdate(
		{ _id: id },
		{ name, },
		{ new: true, runValidators: true }
	);

	// jika id result false / null maka akan menampilkan error `No Category with id` yang dikirim client
	if (!result) throw new NotFoundError(`No Category with id :  ${id}`);

	return result;
};

const deleteCategories = async (req) => {
	const { id } = req.params;

	const result = await Categories.findOne({
		_id: id,
		// company: req.user.company,
	});

	if (!result) throw new NotFoundError(`No Category with id :  ${id}`);

	await result.deleteOne();

	return { msg: "Deleted Successfully" }
};

const checkingCategories = async (id) => {
	const result = await Categories.findOne({ _id: id });
	if (!result) throw new NotFoundError(`No Category with id :  ${id}`);
	return result;
};

module.exports = {
	getAllCategories,
	getAllCategories2,
	createCategories,
	getOneCategories,
	updateCategories,
	deleteCategories,
	checkingCategories,
};
