const Product = require('../../api/v2/products/model');
const { checkingImage } = require('./images')
const { checkingSubCategory } = require('./categoriesSub')
const { NotFoundError, BadRequestError, DuplicateError } = require('../../errors');
const { paginate, infiniteScrollData } = require('../../utils/paginationUtils'); // Sesuaikan dengan lokasi utilitas Anda

const createProduct = async (req) => {
	console.log('token', req.user)
	// console.log('token company', req.company)
	// req.body.user = req.user.userId;
	const { image, subCategoryId, name, price, } = req.body;

	await checkingImage(image)
	const subCategory = await checkingSubCategory(subCategoryId)

	const check = await Product.findOne({
		name, price,
		category: subCategory._id,
		company: req.user.companyId,
	});
	if (check) throw new DuplicateError(name, price);

	const result = await Product.create({
		...req.body,
		category: subCategory._id,
		company: req.user.companyId,
	});
	if (!result) throw new BadRequestError('Failed to Create Product.');

	return { msg: 'Success! Product Created Successfully.', data: result };
};

const getAllProducts = async (req, queryFields, search, page, size, filter) => {
	console.log('token', req.user)
	console.log('token company', req.company)
	// const { company } = req.params;
	let condition = { status: 'Published' };
	// let condition = { company: req.user.companyId };
	// let condition = { company: company };
	const result = await paginate(Product, queryFields, search, page, size, filter = condition);
	const populateOptions = [
		{
			path: 'image',
			select: 'url',
		},
	];

	await Product.populate(result.data, populateOptions);
	return result;
};

const getAllProducts2 = async (req, queryFields, search, page, size) => {
	// const query = {
	// 	$or: [
	// 		{ _id: { $regex: search, $options: 'i' } },
	// 	]
	// };
	const result = await infiniteScrollData(Product, queryFields, search, page, size);
	const populateOptions = [
		{
			path: 'image',
			select: 'url',
		},
	];

	await Product.populate(result.data, populateOptions);
	return result;
};

const getOneProduct = async (req) => {
	const { id } = req.params;
	const result = await Product.findOne({
		_id: id,
		company: req.user.companyId,
	})
		.populate('image')
		.populate({
			path: 'category',
			select: 'name',
			popolate: {
				path: 'category'
			}
		}).populate({
			path: 'company',
			select: 'companyName email logo',
		});
	if (!result) throw new NotFoundError(id);

	return result;
};

const updateProduct = async (req) => {
	const { id } = req.params;
	const { image, categoryId, name, price } = req.body;

	await checkingProduct(id)
	await checkingImage(image)
	const subCategory = await checkingSubCategory(categoryId)

	const check = await Product.findOne({
		name, price,
		category: subCategory._id,
		company: req.user.companyId,
		_id: { $ne: id },
	});
	if (check) throw new DuplicateError(name, price);

	const result = await Product.findOneAndUpdate(
		{ _id: id },
		{
			...req.body, category: subCategory._id,
			company: req.user.companyId,
		},
		{ new: true, runValidators: true }
	);
	if (!result) throw new BadRequestError('Update Product Data Failed.');

	return { msg: "Updated Data Successfully", data: result };
};

const deleteProduct = async (req) => {
	const { id } = req.params;
	const result = await Product.findOne({
		_id: id,
		company: req.user.companyId,
	});
	if (!result) throw new NotFoundError(id);
	console.log('delete products', result)
	const imageId = await checkingImage(result.image)
	await imageId.deleteOne();
	await result.deleteOne();

	return { msg: 'Success! Product removed.', data: result };
};

const checkingProduct = async (id) => {
	const result = await Product.findOne({ _id: id });
	if (!result) throw new BadRequestError(`Product with id :  ${id}, Not Found`);
	return result;
};

const changeStatusProduct = async (req) => {
	const { id } = req.params;
	const { status } = req.body;
	const check = await Product.findOne({
		_id: id, status,
		company: req.user.companyId,
	});
	if (!check) throw new NotFoundError(id);

	if (!['Draft', 'Published'].includes(status)) throw new BadRequestError(`Status must type is 'Draft' or 'Published'`);

	const result = await Product.findOneAndUpdate(
		{ _id: id },
		{ status },
		{ new: true, runValidators: true }
	)
	if (!result) throw new BadRequestError('Update Status Product Failed.');
	delete result._doc.password;

	return { msg: `Success! Status Product is ${result.status}.`, data: result }
}

module.exports = {
	getAllProducts,
	getAllProducts2,
	createProduct,
	getOneProduct,
	updateProduct,
	deleteProduct,
	checkingProduct,
	changeStatusProduct
};
