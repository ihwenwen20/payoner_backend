const Orders = require('../../api/v2/orders/model');
const { NotFoundError, BadRequestError, DuplicateError } = require('../../errors');
const midtransClient = require('midtrans-client');

const getClientKeys = () => {
	return {
		serverKey: 'SB-Mid-server-hXtRmMLFWpEo4pMRwuv41Egs',
		clientKey: 'SB-Mid-client-SHanFwCMsfGPGDxC'
	};
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
			select: 'phone',
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

	console.log(result)
	console.log(coreApi)

	let parameter = {
		transaction_details: {
			order_id: result._id,
			gross_amount: result.total,
		},
		// credit_card: {
		// 	secure: true,
		// },
		customer_details: {
			first_name: result.customer.name,
			last_name: "-",
			email: result.customer.email,
			phone: "-",
		},
	};

	// coreApi.charge(parameter)
	// 	.then((chargeResponse) => {
	// 		console.log('chargeResponse:', JSON.stringify(chargeResponse));
	// 	})

	// snap.createTransaction(parameter)
	// 	.then((transaction) => {
	// 		let transactionToken = transaction.token;
	// 		console.log("transactionToken:", transactionToken);

	// 		let transactionRedirectUrl = transaction.redirect_url;
	// 		console.log("transactionRedirectUrl:", transactionRedirectUrl);

	// 		// res.json({
	// 		// 	redirect_url: transactionRedirectUrl,
	// 		// 	token: transactionToken,
	// 		// });
	// 	})
	// 	.catch((e) => {
	// 		console.log("Error occured:", e.message);
	// 	});

	let hasil = await snap.transaction.status(result._id,)
	console.log('hasil', hasil)

	return result;
};

const payWithSnapMidtrans = async (req, res) => {
	const { id } = req.params;
	const result = await Orders.findOne({
		_id: id,
	}).populate({
		path: 'customer',
		select: 'name email contact',
		populate: {
			path: 'contact',
			select: 'phone',
			populate: {
				path: 'addressId',
				select: '-_id address',
			}
		},
	}).populate('company', 'companyName email').select('-__v');
	if (!result) throw new NotFoundError(id);

	// const user = await User.findById(result.user);

	// if (!user) {
	// 	res.status(404);
	// 	throw new Error("User not found!");
	// }

	let snap = new midtransClient.Snap({
		isProduction: false,
		serverKey: 'SB-Mid-server-hXtRmMLFWpEo4pMRwuv41Egs',
		clientKey: 'SB-Mid-client-SHanFwCMsfGPGDxC'
	})

	let parameter = {
		transaction_details: {
			order_id: result._id,
			gross_amount: result.total,
		},
		credit_card: {
			secure: true,
		},
		customer_details: {
			first_name: result.customer.name,
			last_name: "-",
			email: result.customer.email,
			phone: "-",
		},
	};

	snap.createTransaction(parameter)
		.then((transaction) => {
			let transactionToken = transaction.token;
			console.log("transactionToken:", transactionToken);

			let transactionRedirectUrl = transaction.redirect_url;
			console.log("transactionRedirectUrl:", transactionRedirectUrl);

			res.json({
				redirect_url: transactionRedirectUrl,
				token: transactionToken,
			});
		})
		.catch((e) => {
			console.log("Error occured:", e.message);
		});

	return result;
}

const payWithCoreAPIMidtrans = async (req, res) => {
	const { id } = req.params;
	const result = await Orders.findOne({
		_id: id,
	}).populate({
		path: 'customer',
		select: 'name email contact',
		populate: {
			path: 'contact',
			select: 'phone',
			populate: {
				path: 'addressId',
				select: '-_id address',
			}
		},
	}).populate('company', 'companyName email').select('-__v');
	if (!result) throw new NotFoundError(id);

	console.log(result.customer, '<< yang punya')

	// const user = await User.findById(result.user);

	// if (!user) {
	// 	res.status(404);
	// 	throw new Error("User not found!");
	// }

	let coreApi = new midtransClient.CoreApi({
		isProduction: false,
		serverKey: 'SB-Mid-server-hXtRmMLFWpEo4pMRwuv41Egs',
		clientKey: 'SB-Mid-client-SHanFwCMsfGPGDxC'
	})

	console.log(coreApi)

	let parameter = {
		payment_type: "bank_transfer",
		bank_transfer: {
			"bank": "bni"
		},
		transaction_details: {
			order_id: result._id,
			gross_amount: result.total,
		},
		credit_card: {
			secure: true,
		},
		customer_details: {
			first_name: result.customer.name,
			last_name: "-",
			email: result.customer.email,
			phone: "-",
		},
	};

	coreApi.charge(parameter)
		.then((chargeResponse) => {
			console.log('chargeResponse:', JSON.stringify(chargeResponse));
		})
}

const updatePayWithMidtrans = async (req, res) => {
	const { id } = req.params;
	const result = await Orders.findOne({
		_id: id,
	}).populate({
		path: 'customer',
		select: 'name email contact',
		populate: {
			path: 'contact',
			select: 'phone',
			populate: {
				path: 'addressId',
				select: '-_id address',
			}
		},
	}).populate('company', 'companyName email').select('-__v');
	if (!result) throw new NotFoundError(id);

	let apiClient = new midtransClient.Snap({
		isProduction: false,
		serverKey: 'SB-Mid-server-hXtRmMLFWpEo4pMRwuv41Egs',
		clientKey: 'SB-Mid-client-SHanFwCMsfGPGDxC'
	});

	let hasil = await apiClient.transaction.status(result._id)

	if (hasil.transaction_status === 'settlement') {
		console.log('ini udah sattle')
		result.isPaid = true;
		result.paidAt = today;
		console.log(result.isPaid)
		console.log(result.paidAt)
		result.paymentResult = {
			status_message: req.body.status_message,
			transaction_id: req.body.transaction_id,
		};

		await result.save();

		return result
	} else {
		console.log('belum settle')
		res.send('ini belum settle');
	}
}

module.exports = {
	getSingleOrder,
	payWithSnapMidtrans,
	payWithCoreAPIMidtrans,
	updatePayWithMidtrans
};