const Bank = require('../../api/v1/bank/model');
const { NotFoundError, BadRequestError } = require('../../errors');

const getAllBanks = async (req) => {
	const result = await Bank.find({});

	return result;
};

const createBank = async (req) => {
	const { ownerName, bankName, noRekening } = req.body
	if (!ownerName || !bankName || !noRekening) {
		throw new BadRequestError("Please provide all required fields");
	}

	const check = await Bank.findOne({ ownerName });
	if (check) {
		throw new BadRequestError("Bank already exists");
	}

	try {
		const result = await Bank.create({
			ownerName, bankName, noRekening
		});
		return result;
	} catch (err) {
		throw err
	}
};

const getOneBank = async (req) => {
	const { id } = req.params;

	const result = await Bank.findOne({
		_id: id,
	});

	if (!result) throw new NotFoundError(`No value Bank with id :  ${id}`);

	return result;
};

const updateBank = async (req) => {
	const { id } = req.params;
	const { ownerName, bankName, noRekening } = req.body

	// cari Bank dengan field name dan id selain dari yang dikirim dari params
	const check = await Bank.findOne({
		ownerName, bankName, noRekening,
		_id: { $ne: id },
	});

	// apa bila check true / data Bank sudah ada maka kita tampilkan error bad request dengan message Duplicate value Bank Name
	if (check) throw new BadRequestError('Duplicate value Bank Name');

	try {
		const result = await Bank.findOneAndUpdate(
			{ _id: id },
			{ ownerName, bankName, noRekening },
			{ new: true, runValidators: true }
		);

		// jika id result false / null maka akan menampilkan error `No value Bank with id` yang dikirim client
		if (!result) throw new NotFoundError(`No value Bank with id :  ${id}`);

		return result;
	} catch (err) {
		throw err
	}
};

const deleteBank = async (req) => {
	const { id } = req.params;

	const result = await Bank.findOne({
		_id: id,
	});

	if (!result) throw new NotFoundError(`No value Bank with id :  ${id}`);

	await result.deleteOne();

	return { msg: "Deleted Successfully" }
};

const checkingBank = async (id) => {
	const result = await Bank.findOne({ _id: id });

	if (!result) throw new NotFoundError(`No value Bank with id :  ${id}`);

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
