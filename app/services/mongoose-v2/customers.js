const Customers = require('../../api/v2/customers/model');
const { checkingImage } = require('./images');

const { NotFoundError, BadRequestError, DuplicateError, UnauthorizedError, } = require('../../errors');
const { paginateData, infiniteScrollData } = require('../../utils/paginationUtils');

const getAllCustomers = async (req, queryFields, search, page, size, filter) => {
	const result = await paginateData(Customers, queryFields, search, page, size, filter);
	const populateOptions = [
		{
			path: 'contact',
			select: 'phone address',
		},
		{
			path: 'avatar',
			select: '_id url',
		}
	];

	await Customers.populate(result.data, populateOptions);

	return result;
};

const getAllCustomers2 = async (req, queryFields, search, page, size, filter) => {
	const result = await infiniteScrollData(Customers, queryFields, search, page, size, filter);
	const populateOptions = [
		{
			path: 'contact',
			select: 'phone address',
		},
		{
			path: 'avatar',
			select: '_id url',
		}
	];

	await Customers.populate(result.data, populateOptions);

	return result;
};

const createCustomer = async (req) => {
	const { username, name, email, password, confirmPassword } = req.body;

	if (!name || !username || !email || !password || !confirmPassword) throw new NotFoundError();
	if (password !== confirmPassword) throw new BadRequestError("Password and confirm password do not match");

	const check = await Customers.findOne({ username });
	if (check) throw new DuplicateError(username);

	try {
		const result = await Customers.create(req.body);
		if (!result) throw new BadRequestError();

		return { msg: "Customer created successfully", data: result };
	} catch (err) {
		throw err
	}
};

const getDetailCustomer = async (req) => {
	const { id } = req.params;

	const result = await Customers.findOne({ _id: id })
		.populate('avatar')
		.populate('contact')

	if (!result) throw new NotFoundError(id);

	return result;
};

const updateCustomer = async (req) => {
	const { id } = req.params;

	try {
		const result = await Customers.findOneAndUpdate({ _id: id }, req.body, {
			new: true,
			runValidators: true,
		});
		if (!result) throw new NotFoundError(id);

		return { msg: "Updated Successfully", data: result };
	} catch (err) {
		throw err;
	}
};

const deleteCustomer = async (req, res) => {
	const { id } = req.params;

	const result = await Customers.findOne({ _id: id });
	if (!result) throw new NotFoundError(id);
	const avatar = await checkingImage(result.avatar)
	try {
		await avatar.deleteOne()
		await result.deleteOne();
		return { msg: "Success! Customer removed." }
	} catch (err) {
		throw err;
	}
};

module.exports = {
	getAllCustomers,
	getAllCustomers2,
	createCustomer,
	// changeStatusCustomer,
	getDetailCustomer,
	updateCustomer,
	deleteCustomer
};
