const Coverage = require('../../api/v2/coverage/model');
const Address = require('../../api/v2/address/model');
const { checkingCompany } = require('./companies')
const { checkingAddress, createAddress, updateAddress } = require('./address')
const { NotFoundError, BadRequestError, DuplicateError } = require('../../errors');
const { paginate } = require('../../utils/paginationUtils');

const getAllCoverages = async (req, queryFields, search, page, size) => {
	console.log('token', req.user)
	// let condition = {};
	let condition = { publisher: req.user.companyId };
	const result = await paginate(Coverage, queryFields, search, page, size, filter = condition);
	const populateOptions = [
		{
			path: 'addressId',
			select: 'address',
		},
	];
	await Coverage.populate(result.data, populateOptions);
	return result;
};

const createCoverage = async (req) => {
	console.log('token', req.user)
	// console.log('token company', req.company)
	const { areaName, codeArea, orderNumber, locationCode, secondOrderNumber } = req.body;
	if (!areaName || !codeArea) throw new NotFoundError(areaName, codeArea);

	const check = await Coverage.findOne({
		areaName, codeArea,
		publisher: req.user.companyId,
	});
	if (check) throw new DuplicateError(areaName, codeArea,);

	const address = await createAddress(req)
	const result = await Coverage.create({
		...req.body,
		codeArea: generateCodeArea(orderNumber, locationCode, secondOrderNumber),
		addressId: address.data._id,
		publisher: req.user.companyId,
	});
	console.log('result', result)

	if (Array.isArray(result.addressId) && !result.addressId.length) {
		console.log("Array is an array, and Array is empty!")
		await Address.findByIdAndDelete(address.data._id);
		await result.deleteOne();
		throw new BadRequestError("Invalid Address Data.");
	}

	// Pengecekan jika req.body.addressId tidak ada atau alamat tidak ditemukan dalam array
	// if (!result || !result.data || !result.data._id || !result.data.addressId || !Array.isArray(req.body.addressId) || !req.body.addressId.includes(result.data.addressId.toString())) {
	// }

	return { msg: "Coverage Area created successfully", data: result };
};

const getOneCoverage = async (req) => {
	const { id } = req.params;
	const result = await Coverage.findOne({
		_id: id,
	}).populate({
		path: 'addressId',
		select: 'address',
	}).populate({
		path: 'publisher',
		select: 'companyName email logo',
	});
	if (!result) throw new BadRequestError(`No value Coverage with id :  ${id}`);

	return result;
};

const updateCoverage = async (id, coverageData) => {
	const { areaName, codeArea } = coverageData;
	const c = await checkingCoverage(id)
	const a = await checkingAddress(c.addressId)

	const check = await Coverage.findOne({
		areaName, codeArea,
		addressId: a._id,
		publisher: req.user.companyId,
		_id: { $ne: id },
	});
	if (check) throw new DuplicateError(areaName, codeArea);

	const addresses = await updateAddress(a._id, contactData)
	console.log('addresses', addresses)
	const result = await Coverage.findOneAndUpdate(
		{ _id: id },
		{
			...req.body,
			addressId: addresses._id,
			publisher: req.user.companyId,
		},
		{ new: true, runValidators: true }
	);
	if (!result) throw new BadRequestError('Update Coverage Area Data Failed.');

	return { msg: "Updated Data Successfully", data: result };
};


const deleteCoverage = async (req) => {
	const { id } = req.params;
	const result = await Coverage.findOne({
		_id: id,
		publisher: req.user.companyId,
	});
	if (!result) throw new NotFoundError(id);
	const address = await checkingAddress(result.addressId)
	await address.deleteOne();
	await result.deleteOne();

	return { msg: 'Deleted Successfully', data: result };
};

const checkingCoverage = async (id) => {
	const result = await Coverage.findOne({ _id: id });
	if (!result) throw new BadRequestError(`Area with id :  ${id} Not Found`);

	return result;
};

const changeStatusArea = async (req) => {
	const { id } = req.params;
	const { status } = req.body;
	if (!['Active', 'Inactive'].includes(status)) throw new BadRequestError(`Status must type is 'Active' or 'Inactive'`);

	const check = await Coverage.findOne({
		_id: id, status,
		publisher: req.user.companyId,
	});
	if (!check) throw new NotFoundError(id);
	const result = await Coverage.findOneAndUpdate(
		{ _id: id },
		{ status },
		{ new: true, runValidators: true }
	)
	if (!result) throw new BadRequestError('Update Status Coverage Area Failed.');
	delete result._doc.password;

	return { msg: `Success! Status Area is ${result.status}.`, data: result }
}

module.exports = {
	getAllCoverages,
	createCoverage,
	getOneCoverage,
	updateCoverage,
	deleteCoverage,
	checkingCoverage,
	changeStatusArea
};
