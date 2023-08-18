const Categories = require('../../api/v2/categories/model');
const Orders = require('../../api/v2/orders/model');
const Product = require('../../api/v2/products/model');
const { NotFoundError, BadRequestError, DuplicateError } = require('../../errors');
const { paginateData, infiniteScrollData } = require('../../utils/paginationUtils'); // Sesuaikan dengan lokasi utilitas Anda

const fakeStripeAPI = async ({ amount, currency }) => {
	const client_secret = 'someRandomValue';
	return { client_secret, amount };
};

const createOrder = async (req) => {
	const { items: cartItems, tax, shippingFee } = req.body;

	if (!cartItems || cartItems.length < 1) {
		throw new NotFoundError();
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
			throw new NotFoundError(`No product with id : ${item.product}`);
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

	try {
		const result = await Orders.create({
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

		return { msg: "Order created successfully", data: result };
	} catch (err) {
		throw err;
	}
};

const getAllOrders = async (req, queryFields, search, page, size, filter) => {
	const result = await paginateData(Orders, queryFields, search, page, size, filter);
	const populateOptions = [
		{
			path: 'customer',
			select: 'name, email',
		},
	];

	await Orders.populate(result.data, populateOptions);
	return result;
};

const getAllOrders2 = async (req, queryFields, search, page, size, filter) => {
	const result = await infiniteScrollData(Orders, queryFields, search, page, size, filter);
	const populateOptions = [
		{
			path: 'customer',
			select: 'name, email',
		},
	];

	await Orders.populate(result.data, populateOptions);
	return result;
};

const getSingleOrder = async (req) => {
	const { id } = req.params;

	const result = await Orders.findOne({
		_id: id,
	}).populate({
		path: 'customer',
		select: 'name, email',
	});

	if (!result) throw new NotFoundError();

	return result;
};

const updateOrder = async (req) => {
	const { id } = req.params;

	const order = await Orders.findOneAndUpdate({ _id: id }, req.body, {
		new: true,
		runValidators: true,
	});
	if (!order) throw new NotFoundError(id);
	// checkPermissions(req.user, order.user);

	return { msg: "Updated Successfully", data: order };
};

const deleteOrder = async (req) => {
	const { id } = req.params;
	const order = await checkingOrder(id)
	await order.deleteOne();

	return { msg: 'Deleted Successfully' };
};

const checkingOrder = async (id) => {
	const result = await Orders.findOne({ _id: id });
	if (!result) throw new NotFoundError(id);
	return result;
};

const checkoutOrder = async (req) => {
	const { transaction, personalDetail, payment, products, taxRate = 10 } = req.body;

	// Mengubah nilai taxRate menjadi persentase desimal
	const convertedTaxRate = taxRate * 0.01;
	const checkingTransaction = await Transactions.findOne({ _id: transaction });
	if (!checkingTransaction) {
		throw new NotFoundError('Not found id: ' + transaction);
	}

	const checkingPayment = await Payments.findOne({ _id: payment });
	if (!checkingPayment) {
		throw new NotFoundError('Not found payment method with id: ' + payment);
	}

	let subTotal = 0;
	let totalOrderProduct = 0;
	for (const checkout of products) {
		for (const product of checkingTransaction.products) {
			if (checkout.productCategories.type === product.type) {
				if (checkout.productQuantity > product.stock) {
					throw new NotFoundError('Sorry, Out of Stock');
				} else {
					product.stock -= checkout.productQuantity;

					totalOrderProduct += checkout.productQuantity;
					subTotal += checkout.productCategories.price * checkout.productQuantity;
				}
			}
		}
	}

	// Hitung pajak berdasarkan total pembayaran
	const totalPay = subTotal * convertedTaxRate;

	await checkingTransaction.save();

	const historyTransaction = {
		title: checkingTransaction.title,
		date: checkingTransaction.date,
		description: checkingTransaction.description,
		tagline: checkingTransaction.tagline,
		keyPoint: checkingTransaction.keyPoint,
		publishedIn: checkingTransaction.publishedIn,
		products: products,
		image: checkingTransaction.image,
		category: checkingTransaction.category,
		company: checkingTransaction.company,
	};

	const result = new Orders({
		date: new Date(),
		personalDetail: personalDetail,
		subTotal: subTotal,
		totalOrderProduct: totalOrderProduct,
		orderItems: products,
		customer: req.customer.id,
		transaction: transaction,
		historyTransaction: historyTransaction,
		payment: payment,
		totalPay: totalPay, // Menyimpan jumlah pajak dalam objek result
	});

	await result.save();
	return result;
};

module.exports = {
	getAllOrders,
	getAllOrders2,
	createOrder,
	getSingleOrder,
	updateOrder,
	deleteOrder,
	checkingOrder,
};
