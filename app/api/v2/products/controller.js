const Product = require('./model');
const Images = require('../images/model');

const { StatusCodes } = require('http-status-codes');
const CustomError = require('../../../errors');

const create = async (req, res) => {
  // req.body.user = req.user.userId;
  const product = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({ data: product });
};

const index = async (req, res) => {
  const products = await Product.find({}).populate('image');

  res.status(StatusCodes.OK).json({ data: products, count: products.length });
};

const find = async (req, res) => {
  const { id: productId } = req.params;

  const product = await Product.findOne({ _id: productId })
	.populate('image')
	.populate('category')
	.populate('reviews');

  if (!product) {
    throw new CustomError.NotFoundError(`No product with id : ${productId}`);
  }

  res.status(StatusCodes.OK).json({ product });
};

const update = async (req, res) => {
  const { id: productId } = req.params;

  const product = await Product.findOneAndUpdate({ _id: productId }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    throw new CustomError.NotFoundError(`No product with id : ${productId}`);
  }

  res.status(StatusCodes.OK).json({ product });
};
const destroy = async (req, res) => {
  const { id: productId } = req.params;

  const product = await Product.findOne({ _id: productId });

  if (!product) {
    throw new CustomError.NotFoundError(`No product with id : ${productId}`);
  }

  await product.deleteOne();
  res.status(StatusCodes.OK).json({ msg: 'Success! Product removed.' });
};
const uploadImage = async (req, res) => {
  const result = await Images.create({
		url: req.file
			? `images/products/${req.file.filename}`
			: 'images/products/brosur.png',
	});
  res.status(StatusCodes.OK).json({data: result});
	// return
};

module.exports = {
  create,
  index,
  find,
  update,
  destroy,
  uploadImage,
};