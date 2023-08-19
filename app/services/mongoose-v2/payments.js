const Payments = require('../../api/v2/payments/model');
const { checkingImage } = require('./images');
const { NotFoundError, BadRequestError, DuplicateError } = require('../../errors');
const { paginateData, infiniteScrollData } = require('../../utils/paginationUtils');

const getAllPayments = async (req, queryFields, search, page, size, filter) => {
	const result = await paginateData(Payments, queryFields, search, page, size, filter);
	return result;
};

const getAllPayments2 = async (req, queryFields, search, page, size, filter) => {
	const result = await infiniteScrollData(Payments, queryFields, search, page, size, filter);
	return result;
};

// const getAllPayments = async (req) => {
// 	let condition = { company: req.user.company };

// 	const result = await Payments.find(condition)

// 	return result;
// };

const createPayment = async (req) => {
	const { banks, type, image, } = req.body;
	await checkingImage(image);

	const check = await Payments.findOne({ type, banks, company: req.user.company });
	if (check) throw new DuplicateError();

	const result = await Payments.create({
		image,
		type,
		banks,
		company: req.user.company,
	});
	if (!result) throw new NotFoundError();

	return { msg: "Payments created successfully", data: result };
};

const getOnePayment = async (req) => {
	const { id } = req.params;

	const result = await Payments.findOne({
		_id: id,
		company: req.user.company,
	})
		.populate({
			path: 'image',
			select: '_id name',
		})
		// .select('_id type status image')
		.populate({
			path: 'banks',
		})
	if (!result) throw new NotFoundError(id);

	return result;
};

const updatePayment = async (req) => {
	const { id } = req.params;
	const { banks, type, image } = req.body;
	await checkingPayment(id);
	await checkingImage(image);

	const check = await Payments.findOne({
		type,
		company: req.user.company,
		_id: { $ne: id },
	});
	if (check) throw new DuplicateError();

	const result = await Payments.findOneAndUpdate(
		{ _id: id },
		// { banks, type, image, company: req.user.company },
		{ ...req.body, company: req.user.company },
		{ new: true, runValidators: true }
	);
	if (!result) throw new BadRequestError();

	return { msg: "Updated Data Successfully", data: result };
};

const deletePayment = async (req) => {
	const { id } = req.params;
	const result = await Payments.findOne({
		_id: id,
		company: req.user.company,
	});
	if (!result) throw new NotFoundError(id);
	await result.deleteOne();

	return { msg: "Deleted Successfully" }
};

const checkingPayment = async (id) => {
	const result = await Payments.findOne({ _id: id });
	if (!result) throw new NotFoundError(id);
	return result;
};

const changeStatusPayment = async (req) => {
	const { id } = req.params;
	const payment = await checkingPayment(id)
	const status = payment.status === 'Paid' ? 'Unpaid' : 'Paid'

	const check = await Payments.findOneAndUpdate(
		{ _id: id },
		{ status },
		{ new: true, runValidators: true }
	);
	if (!check) throw new BadRequestError();

	return check;
};

module.exports = {
	getAllPayments,
	getAllPayments2,
	createPayment,
	getOnePayment,
	updatePayment,
	deletePayment,
	checkingPayment,
	changeStatusPayment
};
