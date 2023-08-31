const Categories = require('../../api/v2/categories/model');
const { NotFoundError, BadRequestError, DuplicateError } = require('../../errors');
const { paginate } = require('../../utils/paginationUtils');

// Cara 1
// const getAllCategories = async (req) => {
// 	// const result = await Categories.find({ company: req.user.companyId });
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
const getAllCategories = async (req, queryFields, search, page, size) => {
	console.log('token', req.user)
	// console.log('token company', req.company)
	// let condition = {};
	// let condition = { company: req.user.companyId };
	let condition = { company: { $in: req.user.companyId } };
	const result = await paginate(Categories, queryFields, search, page, size, filter = condition);
	return result;
};

const createCategories = async (req) => {
	console.log('token', req.user)
	// console.log('token company', req.company)
	const { name } = req.body;
	const check = await Categories.findOne({
		name,
		company: req.user.companyId
		// company: { $in: req.user.companyId }
	});
	if (check) throw new DuplicateError(name);

	try {
		const result = await Categories.create({
			...req.body,
			company: req.user.companyId
		});
		if (!result) throw new BadRequestError('Create Category Failed.');

		return { msg: "Category created successfully", data: result };
	} catch (err) {
		throw err
	}
};

const getOneCategories = async (req) => {
	const { id } = req.params;
	const result = await Categories.findOne({
		_id: id,
		// company: req.user.companyId,
		company: { $in: req.user.companyId }
	}).populate({
		path: 'company',
		select: 'companyName email logo',
	});
	if (!result) throw new NotFoundError(id);

	return result;
};

const updateCategories = async (req) => {
	const { id } = req.params;
	const { name } = req.body;

	await Categories.findOne({
		_id: id,
		// company: req.user.companyId,
		company: { $in: req.user.companyId }
	});

	const check = await Categories.findOne({
		name,
		company: req.user.companyId,
		_id: { $ne: id },
	});
	if (check) throw new DuplicateError(name);

	const result = await Categories.findOneAndUpdate(
		{ _id: id },
		{
			...req.body,
			company: req.user.companyId
		},
		{ new: true, runValidators: true }
	);
	if (!result) throw new BadRequestError('Update Category Data Failed.');

	return { msg: "Updated Data Successfully", data: result };
};

const deleteCategories = async (req) => {
	const { id } = req.params;
	const result = await Categories.findOne({
		_id: id,
		company: req.user.companyId,
	});
	if (!result) throw new NotFoundError(id);
	await result.deleteOne();

	return { msg: 'Deleted Successfully', data: result };
};

const checkingCategories = async (id, options = {}) => {
	const query = {
		_id: id,
		...options,
	};

	if (options.excludeId) {
		query._id = { $ne: id };
		console.log('duplicate Categories false')
	}
	const result = await Categories.findOne(query);
	if (!result) throw new NotFoundError(id);
	return result;
};

module.exports = {
	getAllCategories,
	createCategories,
	getOneCategories,
	updateCategories,
	deleteCategories,
	checkingCategories,
};
