const Bank = require('../../api/v2/bank/model');
const { NotFoundError, BadRequestError, DuplicateError } = require('../../errors');
const { paginateData, infiniteScrollData } = require('../../utils/paginationUtils'); // Sesuaikan dengan lokasi utilitas Anda

const getAllBanks = async (req, queryFields, search, page, size, filter) => {
	const result = await paginateData(Bank, queryFields, search, page, size, filter);
	const populateOptions = [];

	await Bank.populate(result.data, populateOptions);
	return result;
};

const getAllBanks2 = async (req, queryFields, search, page, size, filter) => {
	const result = await infiniteScrollData(Bank, queryFields, search, page, size, filter);
	const populateOptions = [];

	await Bank.populate(result.data, populateOptions);
	return result;
};

const createBank = async (req) => {
	const { ownerName, bankName, noRekening } = req.body
	if (!ownerName || !bankName || !noRekening) throw new NotFoundError();

	const check = await Bank.findOne({ ownerName, bankName, noRekening, });
	if (check) throw new DuplicateError();

	const result = await Bank.create({ ...req.body });
	if (!result) throw new BadRequestError();

	return { msg: "Bank created successfully", data: result };
};

const getOneBank = async (req) => {
	const { id } = req.params;

	const result = await Bank.findOne({
		_id: id,
	});
	if (!result) throw new NotFoundError(id);

	return result;
};

const updateBank = async (req) => {
	const { id } = req.params;
	const { ownerName, bankName, noRekening } = req.body

	await checkingBank(id);
	// cari Bank dengan field name dan id selain dari yang dikirim dari params
	const check = await Bank.findOne({
		ownerName, bankName, noRekening,
		_id: { $ne: id },
	});
	if (check) throw new DuplicateError();

	const result = await Bank.findOneAndUpdate(
		{ _id: id },
		req.body,
		{ new: true, runValidators: true }
	);
	if (!result) throw new BadRequestError(id);

	return { msg: "Updated Data Successfully", data: result };
};

const deleteBank = async (req) => {
	const { id } = req.params;
	const result = await checkingBank(id)
	await result.deleteOne();

	return { msg: "Deleted Successfully" }
};

const checkingBank = async (id) => {
	const result = await Bank.findOne({ _id: id });
	if (!result) throw new NotFoundError(id);
	return result;
};

module.exports = {
	getAllBanks,
	getAllBanks2,
	createBank,
	getOneBank,
	updateBank,
	deleteBank,
	checkingBank,
};
