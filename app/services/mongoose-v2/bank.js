const Bank = require('../../api/v2/bank/model');
const { NotFoundError, BadRequestError, DuplicateError } = require('../../errors');
const { paginate } = require('../../utils/paginationUtils');

const getAllBanks = async (req, queryFields, search, page, size, filter) => {
	// console.log('token company', req.user)
	console.log('token company', req.company)
	// let condition = {};
	let condition = { publisher: req.user.companyId };
	const result = await paginate(Bank, queryFields, search, page, size, filter = condition);
	const populateOptions = [];

	await Bank.populate(result.data, populateOptions);
	return result;
};

const createBank = async (req) => {
	console.log('token company', req.company)
	const { bankName, noRekening } = req.body
	if (!bankName || !noRekening) throw new NotFoundError(ownerName, bankName, noRekening);

	const check = await Bank.findOne({
		bankName, noRekening,
		publisher: req.user.companyId
	});
	if (check) throw new DuplicateError(bankName + ' ' + noRekening);

	const result = await Bank.create({
		...req.body,
		publisher: req.user.companyId
	});
	if (!result) throw new BadRequestError();

	return { msg: "Bank created successfully", data: result };
};

const getOneBank = async (req) => {
	const { id } = req.params;
	const result = await Bank.findOne({
		_id: id,
		publisher: req.user.companyId
	}).populate({
		path: 'publisher',
		select: 'companyName email logo',
	});
	if (!result) throw new NotFoundError(id);

	return result;
};

const updateBank = async (req, id, bankData) => {
	const { bankName, noRekening } = bankData

	await checkingBank(id);
	const check = await Bank.findOne({
		bankName, noRekening,
		publisher: req.user.companyId,
		_id: { $ne: id },
	});
	if (check) throw new DuplicateError(bankName, noRekening);

	const result = await Bank.findOneAndUpdate(
		{ _id: id },
		{
			...bankData, publisher: req.user.companyId
		},
		{ new: true, runValidators: true }
	);
	if (!result) throw new BadRequestError('Update Bank Data Failed.');

	return { msg: "Updated Data Successfully.", data: result };
};

const deleteBank = async (req) => {
	const { id } = req.params;
	const result = await Bank.findOne({
		_id: id,
		publisher: req.user.companyId
	});
	if (!result) throw new NotFoundError(id);
	await result.deleteOne();

	return { msg: 'Deleted Successfully', data: result };
};

const checkingBank = async (id) => {
	const result = await Bank.findOne({ _id: id });
	if (!result) throw new BadRequestError(`Bank with id: ${id}, was not found`);
	return result;
};

module.exports = {
	getAllBanks,
	createBank,
	getOneBank,
	updateBank,
	deleteBank,
	checkingBank,
};
