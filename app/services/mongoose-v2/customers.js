const Customers = require('../../api/v2/customers/model');
const Contacts = require('../../api/v2/contacts/model')
const { checkingImage } = require('./images');
const { checkingCompany } = require('./companies')
const { checkingContact, createContact, updateContact, deleteContact } = require('./contact')

const { NotFoundError, BadRequestError, DuplicateError, UnauthorizedError, } = require('../../errors');
const { paginate } = require('../../utils/paginationUtils');

const getAllCustomers = async (req, queryFields, search, page, size) => {
	console.log('token', req.user)
	// Mencocokkan perusahaan berdasarkan _id yang ada dalam req.user.companies
	// let condition = { _id: { $in: req.user.companies } };
	// let condition = {};
	let condition = { company: req.user.companyId };
	const result = await paginate(Customers, queryFields, search, page, size, filter = condition);
	const populateOptions = [
		{
			path: 'contact',
			select: '-_id phone',
			populate: {
				path: 'addressId',
				select: '-_id address',
			},
		},
		{
			path: 'avatar',
			select: 'url',
		}
	];
	const useQuery = Customers.find(condition)
		.select('-password -otp -role')
	const customerData = await useQuery.lean().exec();
	await Customers.populate(customerData, populateOptions);
	result.data = customerData;
	// await Customers.populate(result.data, populateOptions);
	return result;
};

const createCustomer = async (req) => {
	const { username, name, email, password, confirmPassword, avatar, companyId } = req.body;

	if (!name || !username || !email || !password || !confirmPassword) throw new NotFoundError(username, name, email, password, confirmPassword);
	if (password !== confirmPassword) throw new BadRequestError("Password and Confirm Password do not match");

	const check = await Customers.findOne({
		username, companyId
	});
	if (check) throw new DuplicateError(username);
	const companies = await checkingCompany(companyId)
	const avatars = await checkingImage(avatar)
	const contacts = await createContact(req)
	console.log('contacts', contacts)
	try {
		const result = await Customers.create({
			...req.body,
			company: companies._id,
			avatar: avatars._id,
			contact: contacts.data._id,
			otp: Math.floor(Math.random() * 999999),
		});
		if (!contacts.data._id || !result || !result.contact || Array.isArray(result.contact) && !result.contact.length) {
			console.log("Array is an array, and Array is empty!")
			await deleteContact(contacts.data._id);
			await result.deleteOne();
			throw new BadRequestError('Create Customer Data Failed. Invalid Contact Data.');
		}
		console.log('result', result)

		delete result._doc.password;
		// delete result._doc.role;
		// delete result._doc.status;
		// delete result._doc.otp;

		return { msg: "Customer created successfully", data: result };
	} catch (err) {
		throw err
	}
};

const getDetailCustomer = async (req) => {
	const { id } = req.params;
	const result = await Customers.findOne({ _id: id })
		.populate('avatar')
		.populate('contact', '-_id phone addressId')
		.populate('addressId', '-_id');
	if (!result) throw new NotFoundError(id);
	delete result._doc.password;
	delete result._doc.role;
	delete result._doc.status;
	delete result._doc.otp;
	return result;
};

const updateCustomer = async (req) => {
	const { id } = req.params;
	const { username, name, email, companyId } = req.body;
	const checkId = await checkingCustomer(id);
	const check = await Customers.findOne({
		username, name, email, companyId,
		_id: { $ne: id },
	});
	if (check) throw new DuplicateError(username, name, email);

	const companies = await checkingCompany(companyId)
	const avatars = await checkingImage(checkId.avatar)
	const contacts = await updateContact(checkId.contact, req.body)
	try {
		const result = await Customers.findOneAndUpdate(
			{ _id: id },
			{
				...req.body,
				company: companies._id,
				avatar: avatars._id,
				contact: contacts.data._id,
			},
			{ new: true, runValidators: true, }
		);
		if (!result) throw new NotFoundError(id);
		delete result._doc.password;
		delete result._doc.role;
		delete result._doc.status;
		delete result._doc.otp;
		return { msg: "Updated Data Successfully", data: result };
	} catch (err) {
		throw err;
	}
};

const deleteCustomer = async (req, res) => {
	const { id } = req.params;

	const result = await Customers.findOne({ _id: id, company: req.user.companyId });
	if (!result) throw new NotFoundError(id);
	const avatar = await checkingImage(result.avatar)
	try {
		await avatar.deleteOne();
		await deleteContact(result.contact)
		await result.deleteOne();
		return { msg: "Success! Customer removed.", data: result }
	} catch (err) {
		throw err;
	}
};

const checkingCustomer = async (id) => {
	const result = await Customers.findOne({ _id: id });
	if (!result) throw new NotFoundError(id);
	return result;
};

const changeStatusCustomer = async (req) => {
	console.log('token', req.user)
	console.log('token company', req.company)
	console.log('token customer', req.customer)
	const { id } = req.params;
	const { status } = req.body;
	const check = await Customers.findOne({ _id: id, company: req.user.companyId });
	if (!check) throw new NotFoundError(id);
	if (!['Active', 'Inactive', 'Pending', 'Suspend', 'Free'].includes(status)) throw new BadRequestError('Status must type is required');

	const result = await Customers.findOneAndUpdate(
		{ _id: id },
		{ status, company: req.user.companyId },
		{ new: true, runValidators: true }
	)
	if (!result) throw new NotFoundError(id);
	// console.log('res', result)
	delete result._doc.password;
	delete result._doc.otp;
	return { msg: `Changed Success! Now, Status ${result.name} is ${result.status}`, data: result };
};

module.exports = {
	getAllCustomers,
	createCustomer,
	getDetailCustomer,
	updateCustomer,
	deleteCustomer,
	checkingCustomer,
	changeStatusCustomer,
};
