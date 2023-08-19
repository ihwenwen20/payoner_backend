const Image = require('../../api/v2/categories/model');
const Product = require('../../api/v2/products/model');
const { checkingImage } = require('./images')
const { checkingSubCategory } = require('./categoriesSub')
const { NotFoundError, BadRequestError, DuplicateError } = require('../../errors');
const { paginateData, infiniteScrollData } = require('../../utils/paginationUtils'); // Sesuaikan dengan lokasi utilitas Anda

const createProduct = async (req) => {
	// req.body.user = req.user.userId;
	const { image, category, name, price, SKU } = req.body;

	await checkingImage(image)
	await checkingSubCategory(category)

	const check = await Product.findOne({
		name, price, SKU
	});
	if (check) throw new DuplicateError();

	try {
		const result = await Product.create({ ...req.body });
		if (!result) throw new BadRequestError();

		return { msg: 'Success! Product created successfully.', data: result };
	} catch (err) {
		throw err;
	}
};

const getAllProducts = async (req, queryFields, search, page, size, filter) => {
	const result = await paginateData(Product, queryFields, search, page, size, filter);
	const populateOptions = [
		{
			path: 'image',
			select: 'url',
		},
	];

	await Product.populate(result.data, populateOptions);
	return result;
};

const getAllProducts2 = async (req, queryFields, search, page, size, filter) => {
	const result = await infiniteScrollData(Product, queryFields, search, page, size, filter);
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
	})
		.populate('image')
		.populate('category')
		.populate('reviews');

	if (!result) throw new NotFoundError();

	return result;
};

const updateProduct = async (req) => {
	const { id } = req.params;
	const { image, category, name, price, SKU } = req.body;

	await checkingImage(image)
	await checkingSubCategory(category)

	const check = await Product.findOne({
		name, price, SKU
	});
	if (check) throw new DuplicateError();

	const result = await Product.findOneAndUpdate(
		{ _id: id },
		req.body,
		{ new: true, runValidators: true }
	);

	if (!result) throw new BadRequestError();

	return { msg: "Updated Data Successfully", data: result };
};

const deleteProduct = async (req) => {
	const { id } = req.params;
	const result = await checkingProduct(id)
	const imageId = await checkingImage(result.image)
	await imageId.deleteOne();
	await result.deleteOne();

	return { msg: 'Success! Product removed.' };
};

const checkingProduct = async (id) => {
	const result = await Product.findOne({ _id: id });
	if (!result) throw new NotFoundError(`No Product with id: ${id}`);
	return result;
};

module.exports = {
	getAllProducts,
	getAllProducts2,
	createProduct,
	getOneProduct,
	updateProduct,
	deleteProduct,
	checkingProduct,
};
