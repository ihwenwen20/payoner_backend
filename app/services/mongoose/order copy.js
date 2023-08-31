const Orders = require('../../api/v2/orders/model');
const Product = require('../../api/v2/products/model');
const StockTransaction = require('../../api/v2/transactions/transactionStock');
const { NotFoundError, BadRequestError, DuplicateError } = require('../../errors');
const { paginateData, infiniteScrollData } = require('../../utils/paginationUtils');

const fakeStripeAPI = async ({ amount, currency }) => {
	const client_secret = 'someRandomValue';
	return { client_secret, amount };
};

const createOrder1 = async (req) => {
	const { items: cartItems, tax, } = req.body;

	if (!cartItems || cartItems.length < 1) throw new NotFoundError();
	if (tax > 100) throw new BadRequestError("Tax cannot be greater than 100%.");

	let orderItems = [];
	let subtotal = 0;

	for (const item of cartItems) {
		const dbProduct = await Product.findOne({ _id: item.product });
		if (!dbProduct) throw new NotFoundError(`No product with id : ${item.product}`);
		if (item.amount > dbProduct.inventory) throw new BadRequestError(`Sorry, Product with id : ${item.product} Out of Stock`);
		// dbProduct.inventory -= item.amount;
		// await dbProduct.save();
		// const stock = await Product.updateOne({ _id: item.product }, { $inc: { inventory: -item.amount } });

		const { name, price, image, inventory, _id, } = dbProduct;
		const singleOrderItem = {
			amount: item.amount,
			name,
			price,
			image,
			inventory,
			product: _id,
		};
		// add item to order
		orderItems = [...orderItems, singleOrderItem];

		// calculate subtotal
		subtotal += item.amount * price;
	}
	// calculate total
	const calculateTax = subtotal * (tax || 0) / 100;
	const total = (calculateTax || 0) + subtotal;

	// get fake client secret
	const paymentIntent = await fakeStripeAPI({
		amount: total * 100,  // Convert to cents (Stripe requires amount in cents)
		currency: 'usd',
	});

	try {
		const result = await Orders.create({
			title: req.body.title,
			publishedIn: req.body.publishedIn,
			date: new Date(Date.now() + (-1 * new Date().getTimezoneOffset() * 60000)).toISOString(),
			orderItems,
			subtotal,
			total,
			calculateTax,
			tax,
			clientSecret: paymentIntent.client_secret,
			paymentId: req.body.paymentId,
			customer: req.body.customer,
			company: req.body.company,
			// historyTransaction: {
			// 	title: historyTransaction.title,
			// 	date: new Date(Date.now() + (-1 * new Date().getTimezoneOffset() * 60000)).toISOString(),
			// 	description: historyTransaction.description,
			// 	publishedIn: historyTransaction.publishedIn,
			// 	company: req.body.company,
			// }
		});
		if (!result) throw new BadRequestError();

		// return { msg: "Order created successfully", data: result };
		return { msg: "Success! Added To Cart.", data: result };
	} catch (err) {
		throw err;
	}
};

const createOrder2 = async (req) => {
	const { items: cartItems, tax } = req.body;

	if (!cartItems || cartItems.length < 1) throw new NotFoundError(items);
	if (tax > 100) throw new BadRequestError("Tax cannot be greater than 100%.");

	let orderItems = [];
	let subtotal = 0;

	for (const item of cartItems) {
		const dbProduct = await Product.findOne({ _id: item.product });
		if (!dbProduct) throw new NotFoundError(`No product with id : ${item.product}`);
		if (item.amount > dbProduct.inventory) throw new BadRequestError(`Sorry, Product with id : ${item.product} Out of Stock`);

		// Reserve stock in the transaction
		const stockTransaction = new StockTransaction({
			products: [{ product: dbProduct._id, amount: item.amount, }],
			status: 'Pending',
		});
		await stockTransaction.save();

		const { name, price, image, inventory, _id } = dbProduct;
		const singleOrderItem = {
			amount: item.amount,
			name,
			price,
			image,
			inventory,
			product: _id,
		};
		orderItems = [...orderItems, singleOrderItem];
		subtotal += item.amount * price;
	}

	const calculateTax = subtotal * (tax || 0) / 100;
	const total = (calculateTax || 0) + subtotal;

	const paymentIntent = await fakeStripeAPI({
		amount: total * 100,
		currency: 'usd',
	});

	try {
		const order = new Orders({
			title: req.body.title,
			publishedIn: req.body.publishedIn,
			date: new Date(Date.now() + (-1 * new Date().getTimezoneOffset() * 60000)).toISOString(),
			status: req.body.status,
			orderItems,
			subtotal,
			total,
			calculateTax,
			tax,
			clientSecret: paymentIntent.client_secret,
			paymentId: req.body.paymentId,
			customer: req.body.customer,
			company: req.body.company,
		});

		await order.save();
		if (order.status === 'Paid') {
			for (const item of cartItems) {
				const dbProduct = await Product.findOne({ _id: item.product });
				if (dbProduct) {
					if (item.amount > dbProduct.inventory) throw new BadRequestError(`Sorry, Product with id : ${item.product} Out of Stock`);
					dbProduct.inventory -= item.amount;
					await dbProduct.save();
					const stockTransaction = new StockTransaction({
						products: [{ product: dbProduct._id, amount: item.amount }],
						status: 'Paid',
					});
					await stockTransaction.save();
				}
			}
		} else if (order.status === 'Cancelled' || order.status === 'Failed') {
			await Orders.findByIdAndDelete(order._id);
		}

		await order.save();
		return { msg: "Order created successfully", data: order };
	} catch (err) {
		throw err;
	}
};

const createOrder = async (req) => {
	const { items: cartItems, tax } = req.body;

	if (!cartItems || cartItems.length < 1) throw new NotFoundError(items);
	if (tax > 100) throw new BadRequestError("Tax cannot be greater than 100%.");

	let orderItems = [];
	let subtotal = 0;

	for (const item of cartItems) {
		const dbProduct = await Product.findOne({ _id: item.product });
		if (!dbProduct) throw new NotFoundError(`No product with id : ${item.product}`);
		const stockTransaction = new StockTransaction({
			products: [{ product: dbProduct._id, amount: item.amount, }],
			status: 'Pending',
		});
		await stockTransaction.save();

		const { name, price, image, _id } = dbProduct;
		const singleOrderItem = {
			amount: item.amount,
			name,
			price,
			image,
			product: _id,
		};
		orderItems = [...orderItems, singleOrderItem];
		subtotal += item.amount * price;
	}

	const calculateTax = subtotal * (tax || 0) / 100;
	const total = (calculateTax || 0) + subtotal;

	const paymentIntent = await fakeStripeAPI({
		amount: total * 100,
		currency: 'usd',
	});

	try {
		const order = new Orders({
			title: req.body.title,
			publishedIn: req.body.publishedIn,
			date: new Date(Date.now() + (-1 * new Date().getTimezoneOffset() * 60000)).toISOString(),
			status: req.body.status,
			orderItems,
			subtotal,
			total,
			calculateTax,
			tax,
			clientSecret: paymentIntent.client_secret,
			paymentId: req.body.paymentId,
			customer: req.body.customer,
			company: req.body.company,
		});

		await order.save();
		if (order.status === 'Paid') {
			for (const item of cartItems) {
				const dbProduct = await Product.findOne({ _id: item.product });
				if (dbProduct) {
					const stockTransaction = new StockTransaction({
						products: [{ product: dbProduct._id, amount: item.amount }],
						status: 'Paid',
					});
					await stockTransaction.save();
				}
			}
		} else if (order.status === 'Cancelled' || order.status === 'Failed') {
			await Orders.findByIdAndDelete(order._id);
		}

		await order.save();
		return { msg: "Order created successfully", data: order };
	} catch (err) {
		throw err;
	}
};

const getAllOrders = async (req, queryFields, search, page, size, filter) => {
	const result = await paginateData(Orders, queryFields, search, page, size, filter);
	const populateOptions = [
		{
			path: 'customer',
			select: 'name email',
			// populate: {
			// 	path: 'contact',
			// 	select: 'phone addressId',
			// 	populate:{
			// 		path: 'addressId',
			// 		// select: 'address',
			// 	}
			// },
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
			select: 'name email',
			populate: {
				path: 'contact',
				select: 'phone addressId',
				populate: {
					path: 'addressId',
					// select: 'address',
				}
			},
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
		select: 'name email contact',
		populate: {
			path: 'contact',
			select: 'address',
		},
	});
	if (!result) throw new NotFoundError();

	return result;
};

const updateOrder = async (req) => {
	const { id } = req.params;

	const result = await Orders.findOneAndUpdate({ _id: id }, req.body, {
		new: true,
		runValidators: true,
	});
	if (!result) throw new NotFoundError(id);
	// checkPermissions(req.user, result.user);

	return { msg: "Updated Data Successfully", data: result };
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

const accountingBalance = async (id) => {
	const order = await Orders.findOne({ _id: id });

	if (!order) throw new NotFoundError(id);

	// Hitung total pendapatan
	let totalIncome = 0;
	order.total.forEach(item => {
		totalIncome += item.price * item.amount;
	});

	// Hitung total pengeluaran (misalnya biaya pengiriman dan pajak)
	const totalExpense = order.shippingFee + order.tax;

	// Hitung total keuntungan
	const totalProfit = totalIncome - totalExpense;

	console.log('Total Income:', totalIncome);
	console.log('Total Expense:', totalExpense);
	console.log('Total Profit:', totalProfit);
	const result = {
		totalIncome,
		totalExpense,
		totalProfit
	};
	return { msg: 'Congrats.. Your Balance..', data: result }
};

const changeStatusOrder = async (req) => {
	console.log('token', req.company)
	const { id } = req.params;
	const { status } = req.body;
	const check = await Orders.findOne({
		_id: id,
		status: 'Unpaid'
	});
	if (!check) throw new NotFoundError(id);
	if (!['Paid', 'Cancelled'].includes(status)) throw new BadRequestError('Status must type is required');

	const result = await Orders.findOneAndUpdate(
		{ _id: id },
		{ status },
		{ new: true, runValidators: true }
	)
	console.log('result', result)
	if (result.status === 'Paid') {
		for (const item of result.orderItems) {
			console.log('item', item);
			const dbProduct = await Product.findOne({ _id: item.product });
			console.log('dbProduct', dbProduct);
			if (dbProduct) {
				if (item.amount > dbProduct.inventory) throw new BadRequestError(`Sorry, Product with id : ${item.name} Out of Stock`);
				dbProduct.inventory -= item.amount;
				await dbProduct.save();
				const { name, price, image, inventory, _id } = dbProduct;
				const singleOrderItem = {
					amount: item.amount,
					name,
					price,
					image,
					inventory,
					product: _id,
				};
				result.orderItems = [...result.orderItems, singleOrderItem];

				const stockTransaction = new StockTransaction({
					products: [{ product: dbProduct._id, amount: item.amount }],
					status: 'Success',
				});
				await stockTransaction.save();
			}
		}
	} else if (result.status === 'Cancelled') {
		for (const item of result.orderItems) {
			const dbProduct = await Product.findOne({ _id: item.product });
			if (dbProduct) {
				dbProduct.inventory += item.amount; // Restore the inventory
				await dbProduct.save();
			}
		}
		await Orders.findByIdAndDelete(result._id);
	}
	return { msg: `Status Changed. Status Order is ${result.status}`, data: result };
}

module.exports = {
	getAllOrders,
	getAllOrders2,
	createOrder,
	getSingleOrder,
	updateOrder,
	deleteOrder,
	checkingOrder, accountingBalance, changeStatusOrder
};



// const fakeStripeAPI = async ({ amount, currency }) => {
// 	const client_secret = 'someRandomValue';
// 	return { client_secret, amount };
// };

// const createOrder = async (req) => {
// 	const { items: cartItems, tax, shippingFee, personalDetail } = req.body;

// 	if (!cartItems || cartItems.length < 1) throw new NotFoundError();

// 	let convertTaxRate = 0;
// 	if (tax > 100) throw new BadRequestError("Tax cannot be greater than 100%.");
// 	if (typeof tax === 'number') {
// 		// Mengubah nilai tax agar menjadi persen jika tidak null
// 		convertTaxRate = tax * 0.01;
// 	}

// 	if (shippingFee < 0) throw new BadRequestError("Shipping fee cannot be negative.");

// 	let orderItems = [];
// 	let subtotal = 0;

// 	for (const item of cartItems) {
// 		const dbProduct = await Product.findOne({ _id: item.product });
// 		if (!dbProduct) throw new NotFoundError(`No product with id : ${item.product}`);
// 		if (item.amount > dbProduct.inventory) throw new BadRequestError(`Sorry, Product with id : ${item.product} Out of Stock`);
// 		dbProduct.inventory -= item.amount;
// 		await dbProduct.save();
// 		// const stock = await Product.updateOne({ _id: item.product }, { $inc: { inventory: -item.amount } });

// 		const { name, price, image, inventory, _id, } = dbProduct;
// 		const singleOrderItem = {
// 			amount: item.amount,
// 			name,
// 			price,
// 			image,
// 			inventory,
// 			product: _id,
// 		};
// 		// add item to order
// 		orderItems = [...orderItems, singleOrderItem];

// 		// calculate subtotal
// 		subtotal += item.amount * price;
// 	}
// 	const calculateTax = subtotal * tax / 100;
// 	// calculate total
// 	// const total = tax + shippingFee + subtotal;
// 	const totalProductPrice = subtotal * convertTaxRate;
// 	const totalWithShipping = subtotal + (shippingFee || 0);
// 	const total = totalProductPrice + (shippingFee || 0) + subtotal;
// 	// get client secret
// 	const paymentIntent = await fakeStripeAPI({
// 		amount: total * 100,  // Convert to cents (Stripe requires amount in cents)
// 		currency: 'usd',
// 	});

// 	try {
// 		const result = await Orders.create({
// 			orderItems,
// 			total,
// 			totalWithShipping,
// 			subtotal,
// 			tax,
// 			shippingFee,
// 			clientSecret: paymentIntent.client_secret,
// 			customer: req.body.customer,
// 			personalDetail: {
// 				name: personalDetail.name,
// 				email: personalDetail.email,
// 			}
// 			// user: req.user.userId,
// 		});
// 		if (!result) throw new BadRequestError();

// 		return { msg: "Order created successfully", data: result };
// 	} catch (err) {
// 		throw err;
// 	}
// };
