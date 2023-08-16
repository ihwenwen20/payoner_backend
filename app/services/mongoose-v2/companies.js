const Companies = require('../../api/v2/companies/model');
const Contact = require('../../api/v2/contact/model');
const Address = require('../../api/v2/address/model');
const { NotFoundError, BadRequestError } = require('../../errors');
const { paginateData, infiniteScrollData } = require('../../utils/paginationUtils');

const getAllCompanies = async (req) => {
	const result = await Companies.find({ owner: req.user.owner });

	return result;
};

const createCompany = async (req) => {
	const { companyName, email, password, mottoCompany, about, logo, birthday, terms, policy, status, speedtest, watermark, phone, address } = req.body;

	const check = await Companies.findOne({
		companyName,
		owner: req.user.company,
	});
	if (check) throw new BadRequestError(`Company with this name: ${companyName} already exists`);

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

	return result;
};

const getOneCompany = async (req) => {
	const { id } = req.params;

	const result = await Companies.findOne({
		_id: id,
		company: req.user.company,
	});

	if (!result) throw new NotFoundError(`Tidak ada Kategori dengan id :  ${id}`);

	return result;
};

const updateCompanyProfile = async (req) => {
	const { id } = req.params;
	const { companyName, mottoCompany, about, logo, birthday, terms, policy, status, speedtest, watermark, phone, email, address } = req.body;

	try {
		// cari field name dan id selain dari yang dikirim dari params
		const checkCompany = await Companies.findOne({
			companyName: req.user.company,
			_id: { $ne: id },
		});

		// apa bila checkCompany true / data company sudah ada maka kita tampilkan error bad request dengan message company nama duplikat
		if (checkCompany) throw new BadRequestError('Data Company already exists');

		const updateFields = {
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
			phone, email, address,
		};

		const result = await Companies.findOneAndUpdate(
			{ _id: id },
			updateFields,
			{ new: true, runValidators: true }
		);

		// jika id result false / null maka akan menampilkan error `Tidak ada Kategori dengan id` yang dikirim client
		if (!result) throw new NotFoundError(`Tidak ada Kategori dengan id :  ${id}`);

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

		return result;
	} catch (err) {
		throw err
	}

};

const deleteCompany = async (req) => {
	const { id } = req.params;

	const result = await Companies.findOne({
		_id: id,
		company: req.user.company,
	});

	if (!result) throw new NotFoundError(`Tidak ada Kategori dengan id :  ${id}`);

	await result.deleteOne();

	return result;
};

const checkingCompany = async (id) => {
	const result = await Companies.findOne({ _id: id });

	if (!result) throw new NotFoundError(`Tidak ada company dengan id :  ${id}`);

	return result;
};

module.exports = {
	getAllCompanies,
	createCompany,
	getOneCompany,
	updateCompanyProfile,
	deleteCompany,
	checkingCompany,
};