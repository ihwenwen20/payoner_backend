const Order = require('./model');
const Product = require('../products/model');

const { StatusCodes } = require('http-status-codes');
const CustomError = require('../../../errors');
// const { checkPermissions } = require('../utils');

const fakeStripeAPI = async ({ amount, currency }) => {
	const client_secret = 'someRandomValue';
	return { client_secret, amount };
};

const create = async (req, res) => {
	const { items: cartItems, tax, shippingFee } = req.body;

	if (!cartItems || cartItems.length < 1) {
		throw new CustomError.BadRequestError('No cart items provided');
	}

	let convertTaxRate = 0;
	if (typeof tax === 'number') {
		// Mengubah nilai tax agar menjadi persen jika tidak null
		convertTaxRate = tax * 0.01;
	}

	let orderItems = [];
	let subtotal = 0;

	for (const item of cartItems) {
		const dbProduct = await Product.findOne({ _id: item.product });
		if (!dbProduct) {
			throw new CustomError.NotFoundError(
				`No product with id : ${item.product}`
			);
		}
		const { name, price, image, _id } = dbProduct;
		const singleOrderItem = {
			amount: item.amount,
			name,
			price,
			image,
			product: _id,
		};
		// add item to order
		orderItems = [...orderItems, singleOrderItem];
		// calculate subtotal
		subtotal += item.amount * price;
	}
	// calculate total
	// const total = tax + shippingFee + subtotal;
	const totalProductPrice = subtotal * convertTaxRate;
	const totalWithShipping = subtotal + (shippingFee || 0);
	const total = totalProductPrice + (shippingFee || 0) + subtotal;
	// get client secret
	const paymentIntent = await fakeStripeAPI({
		amount: total * 100,  // Convert to cents (Stripe requires amount in cents)
		currency: 'usd',
	});

	const order = await Order.create({
		orderItems,
		total,
		totalWithShipping,
		subtotal,
		tax,
		shippingFee,
		clientSecret: paymentIntent.client_secret,
		customer: req.body.customer
		// user: req.user.userId,
	});

	res
		.status(StatusCodes.CREATED)
		.json({ order, clientSecret: order.clientSecret });
};

const index = async (req, res) => {
	const orders = await Order.find({});
	res.status(StatusCodes.OK).json({ orders, count: orders.length });
};
const find = async (req, res) => {
	const { id: orderId } = req.params;
	const order = await Order.findOne({ _id: orderId });
	if (!order) {
		throw new CustomError.NotFoundError(`No order with id : ${orderId}`);
	}
	// checkPermissions(req.user, order.user);
	res.status(StatusCodes.OK).json({ order });
};
const getCurrentUserOrders = async (req, res) => {
	const orders = await Order.find({ user: req.user.userId });
	res.status(StatusCodes.OK).json({ orders, count: orders.length });
};
const update = async (req, res) => {
	const { id: orderId } = req.params;
	const { paymentIntentId } = req.body;

	const order = await Order.findOne({ _id: orderId });
	if (!order) {
		throw new CustomError.NotFoundError(`No order with id : ${orderId}`);
	}
	// checkPermissions(req.user, order.user);

	order.paymentIntentId = paymentIntentId;
	order.status = 'paid';
	await order.save();

	res.status(StatusCodes.OK).json({ order });
};

module.exports = {
	index,
	find,
	getCurrentUserOrders,
	create,
	update,
};