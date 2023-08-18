const Customer = require('../../api/v1/customers/model');
const Transactions = require('../../api/v1/transactions/model');
const Orders = require('../../api/v1/orders/model');
const Payments = require('../../api/v1/payments/model');

const {
	BadRequestError,
	NotFoundError,
	UnauthorizedError,
} = require('../../errors');
const { createTokenCustomer, createJWT } = require('../../utils');

const { otpMail } = require('../mail');

const signupCustomer = async (req) => {
	const { name, email, password, role } = req.body;

	// jika email dan status tidak aktif
	let result = await Customer.findOne({
		email,
		status: 'not active',
	});

	if (result) {
		result.name = name;
		result.role = role;
		result.email = email;
		result.password = password;
		result.otp = Math.floor(Math.random() * 9999);
		await result.save();
	} else {
		result = await Customer.create({
			name,
			email,
			password,
			role,
			otp: Math.floor(Math.random() * 9999),
		});
	}
	await otpMail(email, result);

	delete result._doc.password;
	delete result._doc.otp;

	return result;
};

const activateCustomer = async (req) => {
	const { otp, email } = req.body;
	const check = await Customer.findOne({
		email,
	});

	if (!check) throw new NotFoundError('Your account has not been registered');

	if (check && check.otp !== otp) throw new BadRequestError('Kode otp salah');

	const result = await Customer.findByIdAndUpdate(
		check._id,
		{
			status: 'active',
		},
		{ new: true }
	);

	delete result._doc.password;

	return result;
};

const signinCustomer = async (req) => {
	const { email, password } = req.body;

	if (!email || !password) {
		throw new BadRequestError('Please provide email and password');
	}

	const result = await Customer.findOne({ email: email });

	if (!result) {
		throw new UnauthorizedError('Invalid Credentials');
	}

	if (result.status === 'not active') {
		throw new UnauthorizedError('Your account is not yet active');
	}

	const isPasswordCorrect = await result.comparePassword(password);

	if (!isPasswordCorrect) {
		throw new UnauthorizedError('Invalid Credentials');
	}

	const token = createJWT({ payload: createTokenCustomer(result) });

	return token;
};

const getAllTransactions = async (req) => {
	const result = await Transactions.find({ statusTransaction: 'Published' })
		.populate('category')
		.populate('image')
		.select('_id title date products publishedIn');

	return result;
};

const getDetailsTransaction = async (req) => {
	const { id } = req.params;
	const result = await Transactions.findOne({ _id: id })
		.populate('category')
		.populate('image')
		.select('_id title date products publishedIn');

	if (!result) throw new NotFoundError(`Not found id :  ${id}`);

	return result;
};

const getAllOrders = async (req) => {
	console.log(req.customer);
	const result = await Orders.find({ customer: req.customer.id });
	return result;
};

/**
 * Tugas Send email invoice
 * TODO: Ambil data email dari personal detail
 *  */
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



const getAllPaymentByCompany = async (req) => {
	const { company } = req.params;

	const result = await Payments.find({ company: company });

	return result;
};

module.exports = {
	signupCustomer,
	activateCustomer,
	signinCustomer,
	getAllTransactions,
	getDetailsTransaction,
	getAllOrders,
	checkoutOrder,
	getAllPaymentByCompany,
};
