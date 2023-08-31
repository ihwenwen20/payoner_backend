const Address = require('../../api/v2/address/model');
const { NotFoundError, BadRequestError, DuplicateError } = require('../../errors');
const { paginate } = require('../../utils/paginationUtils');

const getAllAddresses = async (req, queryFields, search, page, size) => {
	console.log('token', req.user)
	let condition = {};
	const result = await paginate(Address, queryFields, search, page, size, filter = condition);
	return result;
};

const createAddress = async (req) => {
	// const { address } = req.body;
	// const check = await Address.findOne({
	// 	address,
	// });
	// if (check) throw new DuplicateError(address);

	const result = await Address.create({ ...req.body });
	if (!result) throw new BadRequestError('Create Address Data Failed.');

	return { msg: "Address Created Successfully.", data: result };
};

const getDetailAddress = async (req) => {
	const { id } = req.params;
	const result = await Address.findOne({
		_id: id,
	});
	if (!result) throw new NotFoundError(id);

	return result;
};

// const updateAddress = async (req) => {
// 	const { id } = req.params;
// 	await checkingAddress(id);
// 	const result = await Address.findOneAndUpdate(
// 		{ _id: id },
// 		{ ...req.body },
// 		{ new: true, runValidators: true }
// 	);
// 	if (!result) throw new BadRequestError();

// 	return { msg: "Updated Data Successfully", data: result };
// };

const updateAddress = async (id, addressData) => {
	await checkingAddress(id);
	const result = await Address.findOneAndUpdate(
		{ _id: id },
		{ ...addressData },
		{ new: true, runValidators: true }
	);
	if (!result) throw new BadRequestError('Updated Data Address Failed.');

	return { msg: "Updated Data Successfully", data: result };
};

const deleteAddress = async (req) => {
	const { id } = req.params;
	const result = await checkingAddress(id)
	await result.deleteOne();

	return { msg: 'Deleted Address Successfully.', data: result };
};

const checkingAddress = async (id, options = {}) => {
	const query = {
		_id: id,
		...options,
	};

	if (options.excludeId) {
		query._id = { $ne: id };
		console.log('duplicate address false')
	}
	const result = await Address.findOne(query);
	if (!result) throw new NotFoundError(id);
	return result;
};

module.exports = {
	getAllAddresses,
	createAddress,
	getDetailAddress,
	updateAddress,
	deleteAddress,
	checkingAddress,
};
