const SubCategories = require('../../api/v2/categoriesSub/model');
const { checkingCategories } = require('./categories')
const { NotFoundError, BadRequestError, DuplicateError } = require('../../errors');
const { paginate } = require('../../utils/paginationUtils');

const createSubCategory = async (req) => {
	console.log('token', req.user)
	// console.log('token company', req.company)
	const { name, categoryId } = req.body;
	const category = await checkingCategories(categoryId)
	const check = await SubCategories.findOne({
		name,
		category: category._id,
		company: req.user.companyId,
		// company: { $in: req.user.companyId },
	});
	if (check) throw new DuplicateError(name);

	try {
		const result = await SubCategories.create({
			...req.body,
			category: category._id,
			company: req.user.companyId,
		});
		if (!result) throw new BadRequestError(name);

		return { msg: "SubCategories Created Successfully", data: result };
	} catch (err) {
		throw err;
	}
};

const getAllSubCategories = async (req, queryFields, search, page, size) => {
	console.log('token', req.user)
	// console.log('token company', req.company)
	// let condition = {};
	let condition = { company: { $in: req.user.companyId } };
	const result = await paginate(SubCategories, queryFields, search, page, size, filter = condition);
	const populateOptions = [
		// {
		// 	path: 'category',
		// 	select: 'name',
		// },
		// {
		// 	path: 'company',
		// 	select: 'companyName',
		// },
	];

	await SubCategories.populate(result.data, populateOptions);
	return result;
};

const getOneSubCategory = async (req) => {
	const { id } = req.params;
	const result = await SubCategories.findOne({
		_id: id,
		company: req.user.companyId,
	}).populate({
		path: 'category',
		select: 'name -_id',
	}).populate({
		path: 'company',
		select: '-_id companyName email logo',
	}).select('-__v');
	if (!result) throw new NotFoundError(id);

	return result;
};

const updateSubCategory = async (req) => {
	const { id } = req.params;
	const { name, categoryId } = req.body;

	const category = await checkingCategories(categoryId)
	const check = await SubCategories.findOne({
		name,
		category: category._id,
		company: req.user.companyId,
		// company: { $in: req.user.companyId },
		_id: { $ne: id },
	});
	if (check) throw new DuplicateError(name);

	const result = await SubCategories.findOneAndUpdate(
		{ _id: id },
		{
			...req.body, category: category._id,
			company: req.user.companyId,
		},
		{ new: true, runValidators: true }
	);
	if (!result) throw new BadRequestError('Update SubCategory Data Failed.');

	return { msg: "Updated Data Successfully", data: result };
};

const deleteSubCategory = async (req) => {
	const { id } = req.params;
	const result = await SubCategories.findOne({
		_id: id,
		company: req.user.companyId,
		// company: { $in: req.user.companyId },
	});
	if (!result) throw new NotFoundError(id);
	await result.deleteOne();

	return { msg: 'Deleted SubCategory Successfully', data: result };
};

const checkingSubCategory = async (id) => {
	const result = await SubCategories.findOne({ _id: id });
	if (!result) throw new BadRequestError(`SubCategory with id: ${id}, was not found`);
	return result;
};

module.exports = {
	getAllSubCategories,
	createSubCategory,
	getOneSubCategory,
	updateSubCategory,
	deleteSubCategory,
	checkingSubCategory,
};
