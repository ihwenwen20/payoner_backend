const Contact = require('../../api/v2/contacts/model');
const Address = require('../../api/v2/address/model');
const { checkingAddress, createAddress, updateAddress } = require('./address')
const { NotFoundError, BadRequestError, DuplicateError } = require('../../errors');
const { paginate } = require('../../utils/paginationUtils');

const getAllContacts = async (req, queryFields, search, page, size) => {
	let condition = {};
	const result = await paginate(Contact, queryFields, search, page, size, filter = condition);
	const populateOptions = [
		{
			path: 'addressId',
			select: 'address',
		},
	];

	await Contact.populate(result.data, populateOptions);
	return result;
};

const createContact = async (req) => {
	const { name, email, phone } = req.body;

	// const check = await Contact.findOne({
	// 	name, email, phone
	// });
	// if (check) throw new DuplicateError(name, email, phone);
	// console.log('check', check)
	const addresses = await createAddress(req)
	const result = await Contact.create({ ...req.body, addressId: addresses.data._id });
	if (!result) {
		const address = await checkingAddress(addresses.data._id)
		await address.deleteOne();
		throw new BadRequestError('Invalid Address Data.')
	};

	return { msg: "Contact created successfully", data: result };
};

const getOneContact = async (req) => {
	const { id } = req.params;
	const result = await Contact.findOne({
		_id: id,
	}).populate({
		path: 'addressId',
	});
	if (!result) throw new NotFoundError(id);

	return result;
};

// const updateContact = async (req) => {
// 	const { id } = req.params;
// 	const { name, email, phone } = req.body;
// 	const c = await checkingContact(id)
// 	const a = await checkingAddress(c.addressId)
// 	console.log('asa', a)

// 	const check = await Contact.findOne({
// 		name, email, phone,
// 		addressId: a._id,
// 		_id: { $ne: id },
// 	});
// 	console.log('cek', check)
// 	if (check) throw new DuplicateError(name, email, phone);

// 	const addresses = await updateAddress(a._id, req.body)
// 	console.log('adr', addresses)
// 	const result = await Contact.findOneAndUpdate(
// 		{ _id: id },
// 		{
// 			...req.body,
// 			addressId: addresses._id
// 		},
// 		{ new: true, runValidators: true }
// 	);
// 	if (!result) throw new BadRequestError(id);

// 	return { msg: "Updated Data Successfully", data: result };
// };

const updateContact = async (id, contactData) => {
	const { name, email, phone } = contactData;
	const c = await checkingContact(id)
	const a = await checkingAddress(c.addressId)

	const check = await Contact.findOne({
		name, email, phone,
		addressId: a._id,
		_id: { $ne: id },
	});
	if (check) throw new DuplicateError(name, email, phone);

	const addresses = await updateAddress(a._id, contactData)
	const result = await Contact.findOneAndUpdate(
		{ _id: id },
		{
			...contactData,
			addressId: addresses._id
		},
		{ new: true, runValidators: true }
	);
	if (!result) throw new BadRequestError(id);

	return { msg: "Updated Data Successfully", data: result };
};

const deleteContact = async (id) => {
	// const { id } = req.params;
	const result = await checkingContact(id)
	const address = await checkingAddress(result.addressId)
	await address.deleteOne();
	await result.deleteOne();

	return { msg: 'Deleted Successfully', data: result };
};

const checkingContact = async (id) => {
	const result = await Contact.findOne({ _id: id });
	if (!result) throw new NotFoundError(id);
	return result;
};

module.exports = {
	getAllContacts,
	createContact,
	getOneContact,
	updateContact,
	deleteContact,
	checkingContact,
};