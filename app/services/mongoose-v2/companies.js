const Companies = require('../../api/v2/companies/model');
const Users = require('../../api/v2/users/model');
const Income = require('../../api/v2/accounting/income/model');
const Expense = require('../../api/v2/accounting/expense/model');
const Contact = require('../../api/v2/contacts/model')
// const { checkingUser } = require('./users');
const { checkingImage } = require('./images');
const { checkingContact, createContact, updateContact } = require('./contact.js')
const { NotFoundError, BadRequestError, DuplicateError } = require('../../errors');
const { paginate } = require('../../utils/paginationUtils');

const getAllCompanies = async (req, queryFields, search, page, size) => {
	console.log('token', req.user)
	// console.log('token company', req.company)
	// Mencocokkan perusahaan berdasarkan _id yang ada dalam req.user.companies
	// let condition = { _id: { $in: req.user.companyId } };
	// let condition = {};
	let condition = { owner: req.user.userId };
	const result = await paginate(Companies, queryFields, search, page, size, filter = condition);
	const populateOptions = [
		{
			path: 'owner',
			select: 'name email',
		},
		{
			path: 'contact',
			select: 'phone address',
			// populate: 'addressId',
			populate: {
				path: 'addressId',
				select: 'address',
			},
		},
		{
			path: 'logo',
			select: 'url',
		}
	];
	const useQuery = Companies.find(condition)
		.select('-password -role')
	const companyData = await useQuery.lean().exec();
	await Companies.populate(companyData, populateOptions);
	result.data = companyData;
	// await Companies.populate(result.data, populateOptions);
	return result;
};

// const createCompany = async (req) => {
// 	// console.log('token from company', req.user);
// 	const { companyName, email, password, confirmPassword } = req.body;
// 	if (!companyName || !email || !password || !confirmPassword) throw new NotFoundError(companyName, email, password);
// 	if (password !== confirmPassword) throw new BadRequestError("Password and Confirm Password do not match");

// 	const check = await Companies.findOne({
// 		companyName, email,
// 		// owner: req.user.userId,
// 		// companyName: { $ne: companyName },
// 		// email: { $ne: email },
// 		_id: { $ne: req.user.companies },
// 	});
// 	console.log('check companies', check)
// 	if (check) throw new DuplicateError(companyName, email);
// 	const logos = await createImages(req)
// 	console.log('logo', logos)
// 	const contacts = await createContact(req)
// 	console.log('contact companies', contacts)
// 	const result = await Companies.create({
// 		...req.body,
// 		// owner: req.user.userId,
// 		logo: logos.data._id,
// 		contact: contacts.data._id,
// 	});
// 	if (!result) throw new BadRequestError();

// 	delete result._doc.password;
// 	delete result._doc.companies;
// 	delete result._doc.otp;
// 	// console.log('result companies', result)

// 	return { msg: "Companies created successfully", data: result };
// };

const createCompany = async (req) => {
	console.log('token from company', req.user);
	const { companyName, email, password, confirmPassword, logo } = req.body;
	if (!companyName || !email || !password || !confirmPassword) throw new NotFoundError(companyName, email, password);
	if (password !== confirmPassword) throw new BadRequestError("Password and Confirm Password does no match");

	const owners = await Users.findOne({ _id: req.user.userId });
	if (!owners) throw new NotFoundError(req.user.userId);
	console.log('tes owner', owners)

	const check = await Companies.findOne({
		companyName, email,
		owner: req.user.userId,
		// companyName: { $ne: companyName },
		// email: { $ne: email },
	});
	console.log('check companies', check)
	if (check) throw new DuplicateError(companyName, email);
	const logos = await checkingImage(logo)
	const contacts = await createContact(req)
	console.log('contact company', contacts)
	const result = new Companies({
		...req.body,
		owner: req.user.userId,
		logo: logos._id,
		contact: contacts.data._id,
	});
	await result.save();
	if (!result || !result.contact || result.contact.length === 0) {
		console.log("Company or Company's contact is empty");
		await Contact.findByIdAndDelete(contacts.data._id);
		await result.deleteOne();
		throw new BadRequestError("Invalid Contact Data.");
	};
	console.log('result companies', result)
	owners.companies.push(result._id);
	await owners.save();

	const income = new Income({
		company: result._id
	});

	await income.save();
	const expense = new Expense({
		company: result._id
	});
	await expense.save();

	delete result._doc.password;
	delete result._doc.role;
	// delete result._doc.status;

	return { msg: "Companies created successfully", data: result };
};

const getOneCompany = async (req,) => {
	const { id } = req.params;
	const result = await Companies.findOne({
		_id: id,
		owner: req.user.userId,
	})
		.populate({
			path: 'owner',
			select: 'name email',
		})
		.populate({
			path: 'contact',
			populate: 'addressId'
		})
		.populate({
			path: 'logo',
			select: 'url'
		});
	if (!result) throw new NotFoundError(id);
	delete result._doc.password;

	return result;
};

const updateCompany = async (req, id, companyData) => {
	console.log('token', req.user);
	const { companyName, email, password, confirmPassword } = companyData;
	if (password !== confirmPassword) throw new BadRequestError("Password and Confirm Password do not match");

	const companies = await checkingCompany(id);
	const logos = await checkingImage(companies.logo)
	console.log('logo', logos)
	const check = await Companies.findOne({
		companyName, email,
		owner: req.user.userId,
		_id: { $ne: id },
	});
	console.log('check', check)
	if (check) throw new DuplicateError(companyName, email);
	const contacts = await updateContact(companies.contact, req.body)
	console.log('contacs', contacts)
	const result = await Companies.findOneAndUpdate(
		{ _id: id },
		{
			...companyData, owner: req.user.userId, contact: contacts.data._id,
			logo: logos._id,
		},
		{ new: true, runValidators: true }
	);
	if (!result) throw new BadRequestError('Updated Company Data Failed.');
	delete result._doc.password;
	// delete result._doc.companies;
	// delete result._doc.otp;

	return { msg: "Updated Data Successfully", data: result };
};

// const updateCompany = async (req) => {
// 	// console.log('token', req.user);
// 	const { id } = req.params;
// 	const { companyName, email, password, confirmPassword } = req.body;
// 	if (password !== confirmPassword) throw new BadRequestError("Password and Confirm Password do not match");

// 	const companies = await checkingCompany(id);
// 	const logos = await checkingImage(companies.logo)
// 	console.log('logo', logos)
// 	// cari field name dan id selain dari yang dikirim dari params
// 	const check = await Companies.findOne({
// 		companyName, email,
// 		owner: req.user.userId,
// 		_id: { $ne: id },
// 	});
// 	console.log('check', check)
// 	if (check) throw new DuplicateError(companyName, email);
// 	const contacts = await updateContact(companies.contact, req.body)
// 	console.log('contacs', contacts)
// 	const result = await Companies.findOneAndUpdate(
// 		{ _id: id },
// 		{
// 			...req.body, owner: req.user.userId, contact: contacts.data._id,
// 			logo: logos._id,
// 		},
// 		{ new: true, runValidators: true }
// 	);
// 	if (!result) throw new BadRequestError();

// 	return { msg: "Updated Data Successfully", data: result };
// };

const deleteCompany = async (id, req) => {
	if (id === { owner: req.user.userId } || id === req.user.companyId) throw new BadRequestError('You cannot delete yourself.');

	const result = await checkingCompany(id, {
		owner: req.user.userId,
	});
	const logos = await checkingImage(result.logo);
	const contacts = await checkingContact(result.contact)

	await logos.deleteOne();
	await contacts.deleteOne();
	await result.deleteOne();

	delete result._doc.password;
	delete result._doc.companies;
	delete result._doc.otp;

	return { msg: 'Deleted Successfully', data: result };
};

const checkingCompany = async (id, options = {}) => {
	const query = {
		_id: id,
		...options,
	};

	if (options.excludeId) {
		query._id = { $ne: id };
		console.log('duplicate companies false')
	}
	const result = await Companies.findOne(query);
	if (!result) throw new NotFoundError(id);
	return result;
};

const changeStatusCompany = async (req) => {
	const { id } = req.params;
	const { status } = req.body;
	if (!['Active', 'Inactive', 'Suspend'].includes(status)) throw new BadRequestError('Status must type is required');

	await checkingCompany(id, {
		owner: req.user.userId,
	});

	const result = await Companies.findOneAndUpdate(
		{ _id: id },
		{ status, owner: req.user.userId },
		{ new: true, runValidators: true }
	)
	if (!result) throw new BadRequestError('Updated Status Company Failed');
	delete result._doc.password;
	delete result._doc.companies;
	delete result._doc.otp;

	return { msg: `Success! Status ${result.companyName} Changed.`, data: result }
}

module.exports = {
	getAllCompanies,
	createCompany,
	getOneCompany,
	updateCompany,
	deleteCompany,
	checkingCompany,
	changeStatusCompany,
};