const Orders = require('../../api/v2/orders/model');
const Product = require('../../api/v2/products/model');
const StockTransaction = require('../../api/v2/transactions/transactionStock');
const Income = require('../../api/v2/accounting/income/model');
const { NotFoundError, BadRequestError, DuplicateError } = require('../../errors');
const { paginate, infiniteScrollData } = require('../../utils/paginationUtils');
const midtransClient = require('midtrans-client');

const fakeStripeAPI = async ({ amount, currency }) => {
	const client_secret = 'someRandomValue';
	return { client_secret, amount };
};

// const fakeStripeAPI = async ({ amount, currency }) => {

// 	return { client_secret, amount };
// };

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
	const { items: cartItems, tax, discount, discountType } = req.body;

	if (!cartItems || cartItems.length < 1) throw new NotFoundError(items);
	if (tax > 100) throw new BadRequestError("Tax cannot be greater than 100%.");

	let orderItems = [];
	let subtotal = 0;

	for (const item of cartItems) {
		const dbProduct = await Product.findOne({ _id: item.product, status: 'Published' });
		// console.log('product published', dbProduct)
		if (!dbProduct) throw new NotFoundError(`No product with id : ${item.product}`);
		// const stockTransaction = new StockTransaction({
		// 	products: [{ product: dbProduct._id, amount: item.amount, }],
		// 	status: 'Pending',
		// });
		// await stockTransaction.save();

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

	let disc = []
	const calculateTax = subtotal * (tax || 0) / 100;
	const total = (calculateTax || 0) + subtotal;
	if (discountType === "Percent" || discountType === "percent" || discountType === "%") {
		disc = discount / 100;
		totalWithDiscount = total - (total * disc || 0);
	} else if (discountType === "Amount" || discountType === "amount") {
		disc = discount
		totalWithDiscount = total - (disc || 0);
	}
	const finalTotal = totalWithDiscount || total;

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
			total: finalTotal,
			discount: disc,
			totalWithDiscount,
			calculateTax,
			tax,
			clientSecret: paymentIntent.client_secret,
			paymentId: req.body.paymentId,
			customer: req.body.customer,
			company: req.body.company,
		});



		// await order.save();
		// if (order.status === 'Paid') {
		// 	for (const item of cartItems) {
		// 		const dbProduct = await Product.findOne({ _id: item.product });
		// 		if (dbProduct) {
		// 			const stockTransaction = new StockTransaction({
		// 				products: [{ product: dbProduct._id, amount: item.amount }],
		// 				status: 'Success',
		// 			});
		// 			await stockTransaction.save();
		// 		}
		// 		const incomeAmount = order.total;

		// 		const income = new Income({
		// 			amount: incomeAmount,
		// 			date: new Date(Date.now() + (-1 * new Date().getTimezoneOffset() * 60000)).toISOString(),
		// 		});
		// 		await income.save();
		// 	}
		// } else if (order.status === 'Cancelled' || order.status === 'Failed') {
		// 	await Orders.findByIdAndDelete(order._id);
		// }

		await order.save();

		// let coreApi = new midtransClient.CoreApi({
		// 	isProduction: false,
		// 	serverKey: 'SB-Mid-server-hXtRmMLFWpEo4pMRwuv41Egs',
		// 	clientKey: 'SB-Mid-client-SHanFwCMsfGPGDxC'
		// });

		// let parameter = {
		// 	"payment_type": "gopay",
		// 	"gopay_partner": {
		// 		"phone_number": "85211891252",
		// 		"country_code": "62",
		// 		"redirect_url": "http://localhost:5000/tess"
		// 	}
		// };

		// const midtransRespose = await coreApi.linkPaymentAccount(parameter)
		// 	.then((response) => {
		// 		console.log('response:');
		// 		console.log(JSON.stringify(response));
		// 	});
		// console.log('midtrans', JSON.stringify(midtransRespose))
		return { msg: "Order created successfully", data: order };
	} catch (err) {
		throw err;
	}
};

const getAllOrders = async (req, queryFields, search, page, size, filter) => {
	console.log('token', req.user)
	// console.log('token company', req.company)
	// let condition = {};
	let condition = { company: { $in: req.user.companyId } };
	const result = await paginate(Orders, queryFields, search, page, size, filter = condition);
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

const getSingleOrder = async (req, res) => {
	const { id } = req.params;

	const result = await Orders.findOne({
		_id: id,
	}).populate({
		path: 'customer',
		select: 'name email contact',
		populate: {
			path: 'contact',
			select: 'phone addressId',
			populate: {
				path: 'addressId',
				select: '-_id address',
			}
		},
	}).populate('company', 'companyName email').select('-__v');
	if (!result) throw new NotFoundError(id);

	let coreApi = new midtransClient.CoreApi({
		isProduction: false,
		serverKey: 'SB-Mid-server-hXtRmMLFWpEo4pMRwuv41Egs',
		clientKey: 'SB-Mid-client-SHanFwCMsfGPGDxC'
	});

	let snap = new midtransClient.Snap({
		isProduction: false,
		serverKey: 'SB-Mid-server-hXtRmMLFWpEo4pMRwuv41Egs',
		clientKey: 'SB-Mid-client-SHanFwCMsfGPGDxC'
	})

	// console.log(result)
	// console.log(result.orderItems)
	const orderItems = result.orderItems;
	let itemDetails = [];
	for (const item of orderItems) {
		const itemDetail = {
			id: item._id,
			// price: item.price,
			quantity: item.amount,
			name: item.name,
			brand: "Midtrans",
			category: "Toys",
			merchant_name: "Midtrans",
			url: "http://toko/toko1?item=abc"
		};
		itemDetails.push(itemDetail);
	}

	let totalItemPrice = 0;
	for (const item of orderItems) {
		totalItemPrice += item.price * item.amount;
	}
	console.log('total', totalItemPrice)
	let parameter = {
		payment_type: "bank_transfer",
		bank_transfer: {
			"bank": "bni"
		},
		transaction_details: {
			order_id: Date.now(),
			gross_amount: result.total,
		},
		// credit_card: {
		// 	secure: true,
		// },
		customer_details: {
			first_name: result.customer.name,
			email: result.customer.email,
			phone: result.customer.contact.phone,
			billing_address: {
				first_name: "TEST",
				last_name: "MIDTRANSER",
				email: "test@midtrans.com",
				phone: "081 2233 44-55",
				address: result.customer.contact.addressId[0].address,
				city: "Jakarta",
				postal_code: "12190",
				country_code: "IDN"
			},
			expiry: {
				// start_time: "2018-12-13 18:11:08 +0700",
				unit: "minutes",
				duration: 1
			},
		},
		shipping_address: {
			first_name: "TEST",
			last_name: "MIDTRANSER",
			email: "test@midtrans.com",
			phone: "0 8128-75 7-9338",
			address: "Sudirman",
			city: "Jakarta",
			postal_code: "12190",
			country_code: "IDN"
		},
		// item_details: itemDetails,
	};

	coreApi.charge(parameter)
		.then((chargeResponse) => {
			console.log('chargeResponse:', JSON.stringify(chargeResponse));
		})
		.catch((e) => {
			console.log('Error occured:', e.message);
		});;

	// snap.createTransaction(parameter)
	// 	.then((transaction) => {
	// 		let transactionToken = transaction.token;
	// 		console.log("transactionToken:", transactionToken);

	// 		let transactionRedirectUrl = transaction.redirect_url;
	// 		console.log("transactionRedirectUrl:", transactionRedirectUrl);

	// 		return { token: transactionToken, redirectUrl: transactionRedirectUrl }
	// 	})
	// 	.catch((e) => {
	// 		console.log("Error occured:", e.message);
	// 	});

	// let hasil = await snap.transaction.status(result._id,)
	// console.log('hasil',hasil)

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

	return { msg: 'Deleted Successfully', data: order };
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
		date: new Date(Date.now() + (-1 * new Date().getTimezoneOffset() * 60000)).toISOString(),
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
		// status: 'Unpaid'
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
			const dbProduct = await Product.findOne({ _id: item.product });
			if (dbProduct) {
				const stockTransaction = new StockTransaction({
					products: [{ product: dbProduct._id, amount: item.amount }],
					status: 'Success',
				});
				// await stockTransaction.save();
			}
		}
		const incomeAmount = result.total;
		// const income = new Income({
		// 	amount: incomeAmount,
		// 	date: new Date(Date.now() + (-1 * new Date().getTimezoneOffset() * 60000)).toISOString(),
		// 	// company: req.body.company
		// 	company: result.company
		// });
		// await income.save();
		const check = await Income.find({
			company: result.company
		})
		console.log('check', check)
	} else if (result.status === 'Cancelled') {
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
