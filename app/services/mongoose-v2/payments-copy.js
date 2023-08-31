const Payments = require('../../api/v2/payments/model');
const Bank = require('../../api/v2/bank/model');
const Image = require('../../api/v2/images/model');
const { checkingBank, createBank } = require('./bank');
const { checkingImage, createImages } = require('./images');
const { NotFoundError, BadRequestError, DuplicateError } = require('../../errors');
const { paginate } = require('../../utils/paginationUtils');

const getAllPayments = async (req, queryFields, search, page, size) => {
	// console.log('token company', req.company)
	// let condition = {};
	let condition = { company: req.user.companyId };
	const result = await paginate(Payments, queryFields, search, page, size, filter = condition);
	const populateOptions = [
		// {
		// 	path: 'bankId',
		// 	select: 'ownerName bankName noRekening',
		// },
		// {
		// 	path: 'company',
		// 	select: 'companyName email logo',
		// },
	];

	await Payments.populate(result.data, populateOptions);
	return result;
};

const createPayment = async (req) => {
	console.log('token', req.user)
	// console.log('token company', req.company)
	const { method, status, image, bankId } = req.body;
	if (!method) throw new NotFoundError(method);

	const check = await Payments.findOne({
		method, status, image, bankId,
		company: req.user.companyId,
	});
	if (check) throw new DuplicateError(method);

	// const img = await createImages(req);
	// const banks = await createBank(req);
	const img = await checkingImage(image);
	const banks = await checkingBank(bankId);
	console.log('img', img)
	console.log('banks', banks)
	const result = await Payments.create({
		...req.body,
		// image: img.data._id,
		// bankId: banks.data._id,
		image: img._id,
		bankId: banks._id,
		company: req.user.companyId,
	});

	if (!result || !result.bankId.length) {
		console.log(" Array is empty!")
		await Image.findByIdAndDelete(img._id);
		await Bank.findByIdAndDelete(banks._id);
		await result.deleteOne();
		throw new BadRequestError('Create Payment Failed. Invalid Bank Data.');
	}

	return { msg: "Payments created successfully", data: result };
};

const getOnePayment = async (req) => {
	const { id } = req.params;
	const result = await Payments.findOne({
		_id: id,
		company: req.user.companyId,
	})
		.populate({
			path: 'image',
			select: 'url',
		})
		// .select('_id method status image')
		.populate({
			path: 'bankId',
			select: 'ownerName bankName noRekening',
		})
		.populate({
			path: 'company',
			select: 'companyName email logo',
		});
	if (!result) throw new NotFoundError(id);

	return result;
};

const updatePayment = async (req) => {
	const { id } = req.params;
	const { bankId, method, image } = req.body;
	await checkingPayment(id);
	const img = await checkingImage(image);
	const banks = await checkingBank(bankId);

	const check = await Payments.findOne({
		method,
		image: img._id,
		bankId: banks._id,
		company: req.user.companyId,
		_id: { $ne: id },
	});
	if (check) throw new DuplicateError(method);

	const result = await Payments.findOneAndUpdate(
		{ _id: id },
		{
			...req.body,
			image: img._id,
			bankId: banks._id,
			company: req.user.companyId,
		},
		{ new: true, runValidators: true }
	);
	if (!result || !result.bankId.length) {
		console.log(" Array is empty!")
		await Image.findByIdAndDelete(img._id);
		await Bank.findByIdAndDelete(banks._id);
		await result.deleteOne();
		throw new BadRequestError('Update Payment Data Failed. Invalid Bank Data.');
	}

	return { msg: "Updated Data Successfully", data: result };
};

const deletePayment = async (req) => {
	const { id } = req.params;
	const result = await Payments.findOne({
		_id: id,
		company: req.user.companyId,
	});
	if (!result) throw new NotFoundError(id);
	await Image.findByIdAndDelete(result._id);
	await Bank.findByIdAndDelete(result._id);
	await result.deleteOne();

	return { msg: "Deleted Successfully", data: result }
};

const checkingPayment = async (id) => {
	const result = await Payments.findOne({ _id: id });
	if (!result) throw new BadRequestError(`Payment with id :  ${id} Not Found`);
	return result;
};

const changeStatusPayment = async (req) => {
	const { id } = req.params;
	const { status } = req.body;
	await checkingPayment(id);
	if (!['Active', 'Inactive'].includes(status)) throw new BadRequestError(`Status must type is 'Active' or 'Inactive'`);

	// const status = payment.status === 'Inactive' ? 'Active' : 'Inactive'
	// const check = await Coverage.findOne({
	// 	_id: id, status,
	// 	publisher: req.user.companyId,
	// });
	// if (!check) throw new NotFoundError(id);

	const result = await Payments.findOneAndUpdate(
		{ _id: id },
		{ status },
		{ new: true, runValidators: true }
	);
	if (!result) throw new BadRequestError('Update Status Payment Failed.');

	return { msg: `Success! Status Payment is ${result.status}.`, data: result }
};

module.exports = {
	getAllPayments,
	createPayment,
	getOnePayment,
	updatePayment,
	deletePayment,
	checkingPayment,
	changeStatusPayment
};
