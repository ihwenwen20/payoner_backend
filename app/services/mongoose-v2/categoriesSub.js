const Categories = require('../../api/v2/categories/model');
const SubCategories = require('../../api/v2/categoriesSub/model');
const { NotFoundError, BadRequestError, DuplicateError } = require('../../errors');
const { paginateData, infiniteScrollData } = require('../../utils/paginationUtils'); // Sesuaikan dengan lokasi utilitas Anda

const createSubCategory = async (req) => {
	const { name, categoryId } = req.body;

	const category = await Categories.findOne({
		_id: categoryId,
	});

	if (!category) throw new NotFoundError('Category not found');

	const check = await SubCategories.findOne({
		name,
		category: category._id,
	});

	if (check) throw new DuplicateError();

	try {
		const result = await SubCategories.create({
			name,
			category: category._id,
		});

		return result;
	} catch (err) {
		throw err;
	}
};

const getAllSubCategories = async (req, queryFields, search, page, size, filter) => {
	const result = await paginateData(SubCategories, queryFields, search, page, size, filter);
	const populateOptions = [
		{
			path: 'category',
			select: 'name',
		},
	];

	await SubCategories.populate(result.data, populateOptions);
	return result;
};

const getAllSubCategories2 = async (req, queryFields, search, page, size, filter) => {
	const result = await infiniteScrollData(SubCategories, queryFields, search, page, size, filter);
	const populateOptions = [
		{
			path: 'category',
			select: 'name',
		},
	];

	await SubCategories.populate(result.data, populateOptions);
	return result;
};

const getOneSubCategory = async (req) => {
	const { id } = req.params;

	const result = await SubCategories.findOne({
		_id: id,
	}).populate({
		path: 'category',
		select: 'name',
	});

	if (!result) throw new NotFoundError();

	return result;
};

const updateSubCategory = async (req) => {
	const { id } = req.params;
	const { name, categoryId } = req.body;

	const category = await Categories.findOne({
		_id: categoryId,
	});

	if (!category) throw new NotFoundError('Category not found');

	const check = await SubCategories.findOne({
		name,
		category: category._id,
		_id: { $ne: id },
	});

	if (check) throw new BadRequestError('Duplicate Subcategory Name');

	const result = await SubCategories.findOneAndUpdate(
		{ _id: id },
		{ name, category: category._id },
		{ new: true, runValidators: true }
	);

	if (!result) throw new NotFoundError(`No Subcategory with id: ${id}`);

	return result;
};

const deleteSubCategory = async (req) => {
	const { id } = req.params;

	const result = await SubCategories.findOne({
		_id: id,
	});

	if (!result) throw new NotFoundError(id);

	await result.deleteOne();

	return { msg: 'Deleted Successfully' };
};

const checkingSubCategory = async (id) => {
	const result = await SubCategories.findOne({ _id: id });
	if (!result) throw new NotFoundError(`No Subcategory with id: ${id}`);
	return result;
};

module.exports = {
	getAllSubCategories,
	getAllSubCategories2,
	createSubCategory,
	getOneSubCategory,
	updateSubCategory,
	deleteSubCategory,
	checkingSubCategory,
};
