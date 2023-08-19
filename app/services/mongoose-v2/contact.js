const Contact = require('../../api/v2/contacts/model');
const Address = require('../../api/v2/address/model');
const { checkingAddress } = require('./address')
const { NotFoundError, BadRequestError, DuplicateError } = require('../../errors');
const { paginateData, infiniteScrollData } = require('../../utils/paginationUtils'); // Sesuaikan dengan lokasi utilitas Anda

const getAllContacts = async (req, queryFields, search, page, size, filter) => {
	const result = await paginateData(Contact, queryFields, search, page, size, filter);
	const populateOptions = [
		{
			path: 'address',
			select: 'address',
		},
	];

	await Contact.populate(result.data, populateOptions);
	return result;
};

const getAllContacts2 = async (req, queryFields, search, page, size, filter) => {
	const result = await infiniteScrollData(Contact, queryFields, search, page, size, filter);
	const populateOptions = [
		{
			path: 'address',
			select: 'address',
		},
	];

	await Contact.populate(result.data, populateOptions);
	return result;
};

const createContact = async (req) => {
	const { address, name } = req.body;
	const checkAddress = await checkingAddress(address)

	const check = await Contact.findOne({
		name,
		address: checkAddress._id,
	});
	if (check) throw new DuplicateError();
	const result = await Contact.create({ ...req.body });
	if (!result) throw new BadRequestError();

	return { msg: "Contact created successfully", data: result };
};

const getOneContact = async (req) => {
	const { id } = req.params;
	const result = await Contact.findOne({
		_id: id,
	}).populate({
		path: 'address',
	});
	if (!result) throw new NotFoundError();

	return result;
};

const updateContact = async (req) => {
	const { id } = req.params;
	const { name, address } = req.body;
	await checkingContact(id)
	// const checkAddress = await checkingAddress(address)

	const check = await Contact.findOne({
		name,
		// address: checkAddress._id,
		_id: { $ne: id },
	});
	if (check) throw new DuplicateError();

	const result = await Contact.findOneAndUpdate(
		{ _id: id },
		{
			...req.body,
			// address: checkAddress._id
		},
		{ new: true, runValidators: true }
	);
	if (!result) throw new BadRequestError(id);

	return { msg: "Updated Data Successfully", data: result };
};

const deleteContact = async (req) => {
	const { id } = req.params;
	const result = await checkingContact(id)
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
	getAllContacts2,
	createContact,
	getOneContact,
	updateContact,
	deleteContact,
	checkingContact,
};