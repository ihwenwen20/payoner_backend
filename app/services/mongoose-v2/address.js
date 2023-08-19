const Address = require('../../api/v2/address/model');
const { NotFoundError, BadRequestError, DuplicateError } = require('../../errors');
const { paginateData, infiniteScrollData } = require('../../utils/paginationUtils');

const getAllAddresses = async (req, queryFields, search, page, size, filter) => {
	const result = await paginateData(Address, queryFields, search, page, size, filter);
	return result;
};

const getAllAddresses2 = async (req, queryFields, search, page, size, filter) => {
	const result = await infiniteScrollData(Address, queryFields, search, page, size, filter);
	return result;
};

const createAddress = async (req) => {
	const { address } = req.body;
	const check = await Address.findOne({
		address,
		// company: req.user.company,
	});
	if (check) throw new DuplicateError(address);

	const result = await Address.create({ ...req.body });
	if (!result) throw new BadRequestError();

	return { msg: "Address created successfully", data: result };
};

const getDetailAddress = async (req) => {
	const { id } = req.params;
	const result = await Address.findOne({
		_id: id,
		// company: req.user.company,
	});
	if (!result) throw new NotFoundError(id);

	return result;
};

const updateAddress = async (req) => {
	const { id } = req.params;
	await checkingAddress(id);
	const result = await Address.findOneAndUpdate(
		{ _id: id },
		req.body,
		{ new: true, runValidators: true }
	);
	if (!result) throw new BadRequestError();

	return { msg: "Updated Data Successfully", data: result };
};

const deleteAddress = async (req) => {
	const { id } = req.params;
	const result = await checkingAddress(id)
	await result.deleteOne();

	return { msg: 'Deleted Successfully', data: result };
};

const checkingAddress = async (id) => {
	const result = await Address.findOne({ _id: id });
	if (!result) throw new NotFoundError(id);
	return result;
};

module.exports = {
	getAllAddresses,
	getAllAddresses2,
	createAddress,
	getDetailAddress,
	updateAddress,
	deleteAddress,
	checkingAddress,
};
