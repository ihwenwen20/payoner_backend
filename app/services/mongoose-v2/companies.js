const Companies = require('../../api/v2/companies/model');
const Contact = require('../../api/v2/contacts/model');
const Address = require('../../api/v2/address/model');
const { NotFoundError, BadRequestError, DuplicateError } = require('../../errors');
const { paginateData, infiniteScrollData } = require('../../utils/paginationUtils');

const getAllCompanies = async (req, queryFields, search, page, size, filter) => {
	const result = await paginateData(Companies, queryFields, search, page, size, filter);
	const populateOptions = [
		{
			path: 'owner',
			select: 'username, name, email',
		},
		{
			path: 'contact',
			select: 'phone address',
		},
		{
			path: 'logo',
			select: '_id url',
		}
	];

	await Companies.populate(result.data, populateOptions);
	return result;
};

const getAllCompanies2 = async (req, queryFields, search, page, size, filter) => {
	const result = await infiniteScrollData(Companies, queryFields, search, page, size, filter);
	const populateOptions = [
		{
			path: 'owner',
			select: 'username, name, email',
		},
		{
			path: 'contact',
			select: 'phone address',
		},
		{
			path: 'logo',
			select: '_id url',
		}
	];

	await Companies.populate(result.data, populateOptions);
	return result;
};

// const getAllCompanies = async (req) => {
// 	const result = await Companies.find({ owner: req.user.owner });

// 	return result;
// };

const createCompany = async (req) => {
	const { companyName, email, password, mottoCompany, about, logo, birthday, terms, policy, status, speedtest, watermark, phone, address } = req.body;

	const check = await Companies.findOne({
		companyName,
		owner: req.user.company,
	});
	if (check) throw new DuplicateError();

	const result = await Companies.create({
		companyName,
		email,
		password,
		mottoCompany,
		about,
		logo,
		birthday,
		terms,
		policy,
		status,
		speedtest,
		watermark,
		phone,
		address,
		owner: req.user._id,
	});
	if (!result) throw new BadRequestError();

	return { msg: "Companies created successfully", data: result };
};

const getOneCompany = async (req) => {
	const { id } = req.params;
	const result = await Companies.findOne({
		_id: id,
		company: req.user.company,
	});
	if (!result) throw new NotFoundError(id);

	return result;
};

const updateCompanyProfile = async (req) => {
	const { id } = req.params;
	const { companyName, mottoCompany, about, logo, birthday, terms, policy, status, speedtest, watermark, phone, email, address } = req.body;
	await checkingCompany(id);

	// cari field name dan id selain dari yang dikirim dari params
	const check = await Companies.findOne({
		companyName: req.user.company,
		_id: { $ne: id },
	});
	if (check) throw new DuplicateError();

	// const updateFields = {
	// 	companyName,
	// 	email,
	// 	password,
	// 	mottoCompany,
	// 	about,
	// 	logo,
	// 	birthday,
	// 	terms,
	// 	policy,
	// 	status,
	// 	speedtest,
	// 	watermark,
	// 	phone, email, address,
	// };

	const result = await Companies.findOneAndUpdate(
		{ _id: id },
		req.body,
		{ new: true, runValidators: true }
	);
	if (!result) throw new BadRequestError();

	// Update data contact
	// if (contact && contact.name) {
	// 	const contactResult = await Contact.findOneAndUpdate(
	// 		{ _id: result.contact },
	// 		{ name: contact.name, phone: contact.phone, email: contact.email, address: contact.address },
	// 		{ new: true, runValidators: true }
	// 	);

	// 	if (!contactResult) {
	// 		throw new NotFoundError(`Tidak ada Contact dengan id: ${result.contact}`);
	// 	}
	// }

	return { msg: "Updated Data Successfully", data: result };
};

const deleteCompany = async (req) => {
	const { id } = req.params;
	const result = await Companies.findOne({
		_id: id,
		company: req.user.company,
	});
	if (!result) throw new NotFoundError(id);
	await result.deleteOne();

	return result;
};

const checkingCompany = async (id) => {
	const result = await Companies.findOne({ _id: id });
	if (!result) throw new NotFoundError(id);
	return result;
};

module.exports = {
	getAllCompanies,
	getAllCompanies2,
	createCompany,
	getOneCompany,
	updateCompanyProfile,
	deleteCompany,
	checkingCompany,
};