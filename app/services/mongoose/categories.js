// import model categories
const Categories = require('../../api/v1/categories/model');

const { paginateData, infiniteScrollData } = require('../../utils/paginationUtils');
const { NotFoundError, BadRequestError } = require('../../errors');

const getAllCategories = async (req, page, size, search) => {
	const query = {
		$or: [
			{ name: { $regex: search, $options: 'i' } },
		]
	};

	const result = await infiniteScrollData(Categories, query, page, size);

	// const result = await Categories.find({ company: req.user.company });
	// const result = await Categories.find({});

	// const populateOptions = [
	// 	{
	// 		path: 'company',
	// 		select: 'companyName',
	// 	},
	// ];

	// await Categories.populate(usersData.data, populateOptions);

	return result;
};

const createCategories = async (req) => {
	const { name } = req.body;

	// cari categories dengan field name
	const check = await Categories.findOne({
		name,
		company: req.user.company,
	});

	// apa bila check true / data categories sudah ada maka kita tampilkan error bad request dengan message Duplicate Category Name
	if (check) throw new BadRequestError('Duplicate Category Name');

	try {
		const result = await Categories.create({
			name,
			company: req.user.company,
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
		company: req.user.company,
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
		company: req.user.company,
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
		company: req.user.company,
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
	createCategories,
	getOneCategories,
	updateCategories,
	deleteCategories,
	checkingCategories,
};
