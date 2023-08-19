const Users = require('../../api/v2/users/model');

const { checkingImage } = require('./images');
const { checkingCompany } = require('./companies');
// const { checkingContact } = require('./contact');
const { NotFoundError, BadRequestError, DuplicateError } = require('../../errors');
const { paginateData, infiniteScrollData } = require('../../utils/paginationUtils');

const getAllUsers = async (req, queryFields, search, page, size, filter) => {
	const result = await paginateData(Users, queryFields, search, page, size, filter);
	const populateOptions = [
		// {
		// 	path: 'companies',
		// 	select: 'companyName',
		// },
		{
			path: 'contact',
			select: 'phone address',
		},
		{
			path: 'avatar',
			select: '_id url',
		}
	];

	await Users.populate(result.data, populateOptions);
	return result;
};

const getAllUsers2 = async (req, queryFields, search, page, size, filter) => {
	const result = await infiniteScrollData(Users, queryFields, search, page, size, filter);
	const populateOptions = [
		// {
		// 	path: 'companies',
		// 	select: 'companyName',
		// },
		{
			path: 'contact',
			select: 'phone address',
		},
		{
			path: 'avatar',
			select: '_id url',
		}
	];

	await Users.populate(result.data, populateOptions);
	return result;
};

const createUser = async (req, res) => {
	const { avatar, name, email, password, confirmPassword,
		companies,
		// companyName,
		// contact,
		// phone, address
	} = req.body;

	if (!name || !email || !password || !confirmPassword) throw new NotFoundError();
	if (password !== confirmPassword) throw new BadRequestError("Password and confirm password do not match");

	const check = await Users.findOne({ email });
	if (check) throw new DuplicateError(email);
	await checkingImage(avatar)
	await checkingCompany(companies)
	// await checkingContact(contact)

	const result = await Users.create({ ...req.body });
	if (!result) throw new BadRequestError();

	delete result._doc.password;

	return { msg: "Users created successfully", data: result };
};

const changeStatusUser = async (req) => {
	const { id } = req.params;
	const { status } = req.body;
	if (!['active', 'pending', 'not active'].includes(status)) throw new BadRequestError('Status must type is required');

	const result = await Users.findOneAndUpdate(
		{ _id: id },
		{ status, },
		{ new: true, runValidators: true }
	)
	if (!result) throw new NotFoundError(BadRequestError);
	return result;
};

const getDetailUser = async (req) => {
	const { id } = req.params;
	const result = await Users.findOne({
		_id: id,
	})
		.populate({
			path: 'company',
		})
		.populate({
			path: 'contact',
			populate: 'address'
		})

	if (!result) throw new NotFoundError(`Not found id :  ${id}`);

	return result;
};

// const updateCompany = async (req) => {
// 	const { id } = req.params;
// 	const { avatar, name, email, role, password, confirmPassword, gender, birthday, status, company, phone, address } = req.body;

// 	try {
// 		// Cari perusahaan berdasarkan field id
// 		const checkUser = await Users.findOne({
// 			_id: id,
// 		});

// 		// Jika id tidak ditemukan, lempar error 'Not found id' kepada client
// 		if (!checkUser) throw new NotFoundError(`Not found id: ${id}`);

// 		const checkCompany = await Companies.findOne({
// 			company,
// 			_id: checkUser.company
// 		});
// 		const checkAddress = await Address.find();
// 		const checkContact = await Contact.find({
// 			name, email, phone, address: checkAddress._id,
// 			_id: checkUser.contact,
// 		});

// 		if (!checkCompany | !checkContact | !checkAddress) throw new BadRequestError('Data Company Not Found');

// 		// Cari pengguna lain yang memiliki data perusahaan yang sama
// 		const check = await Users.findOne({
// 			company: checkUser.company,
// 			_id: { $ne: id },
// 		});
// 		// Jika pengguna dengan data perusahaan yang sama ditemukan, lempar error bad request
// 		if (check) throw new BadRequestError('Data Company already exists');

// 		// Update data perusahaan
// 		const updatedUser = await Users.findOneAndUpdate(
// 			{ _id: id },
// 			{
// 				avatar, name, email, role, password, confirmPassword, gender, birthday, status,
// 			},
// 			{ company },
// 			{ phone, address, },
// 			{ new: true, runValidators: true }
// 		);
// 		if (!updatedUser) throw new NotFoundError(`No value with id : ${id}`);

// 		return updatedUser;
// 	} catch (err) {
// 		throw err;
// 	}
// };

// Chat Gpt1
const updateUser = async (req) => {
	const { id } = req.params;
	const { avatar, name, email, role, password, confirmPassword, gender, birthday, status, companyName, phone, address } = req.body;

	try {
		// Cari perusahaan berdasarkan field id
		const checkUser = await Users.findOne({
			_id: id,
		});

		// Jika id tidak ditemukan, lempar error 'Not found id' kepada client
		if (!checkUser) throw new NotFoundError(`Not found id: ${id}`);

		const checkCompany = await Companies.findOne({
			_id: checkUser.company
		});

		const checkContact = await Contact.findOne({
			_id: checkUser.contact,
		}).populate('address');

		if (!checkCompany || !checkContact) throw new BadRequestError('Data Company Not Found');

		// Cari pengguna lain yang memiliki data perusahaan yang sama
		const checkEmail = await Users.findOne({
			email,
			_id: { $ne: id },
		});
		// Jika email pengguna dengan data perusahaan yang sama ditemukan, lempar error bad request
		if (checkEmail) throw new BadRequestError(`${email} already exists`);

		// Update data perusahaan
		checkUser.avatar = avatar;
		checkUser.name = name;
		checkUser.email = email;
		checkUser.role = role;
		checkUser.password = password;
		checkUser.confirmPassword = confirmPassword;
		checkUser.gender = gender;
		checkUser.birthday = birthday;
		checkUser.status = status;
		checkCompany.companyName = companyName;
		checkContact.name = name;
		checkContact.email = email;
		checkContact.phone = phone;
		checkContact.address.address = address;

		if (password && password !== confirmPassword) throw new BadRequestError('Invalid Credentials');

		await Promise.all([
			checkUser.save(),
			checkCompany.save(),
			checkContact.save(),
			Address.findOneAndUpdate(
				{ _id: checkContact.address._id },
				{ address },
				{ new: true }
			),
		]);

		return checkUser;
	} catch (err) {
		throw err;
	}
};


// chatgpt2
// const updateCompany = async (req) => {
// 	const { id } = req.params;
// 	const { avatar, name, email, role, password, confirmPassword, gender, birthday, status, company, phone, address } = req.body;

// 	try {
// 		// Cari perusahaan berdasarkan field id
// 		const checkUser = await Users.findOne({
// 			_id: id,
// 		});

// 		// Jika id tidak ditemukan, lempar error 'Not found id' kepada client
// 		if (!checkUser) throw new NotFoundError(`Not found id: ${id}`);

// 		const checkCompany = await Companies.findOne({
// 			_id: checkUser.company
// 		});

// 		const checkContact = await Contact.findOne({
// 			_id: checkUser.contact,
// 		}).populate('address');

// 		if (!checkCompany || !checkContact) throw new BadRequestError('Data Company Not Found');

// 		// Cek apakah ada pengguna lain dengan email yang sama
// 		// const checkEmail = await Users.findOne({
// 		//   email: email.toLowerCase(),
// 		//   _id: { $ne: id },
// 		// });
// 		// if (checkEmail) throw new BadRequestError(`${email} already exists`);

// 		// Update data perusahaan
// 		checkUser.avatar = avatar;
// 		checkUser.name = name;
// 		checkUser.email = email;
// 		checkUser.role = role;
// 		checkUser.password = password;
// 		checkUser.confirmPassword = confirmPassword;
// 		checkUser.gender = gender;
// 		checkUser.birthday = birthday;
// 		checkUser.status = status;
// 		checkCompany.company = company;

// 		if (password && password !== confirmPassword) {
// 			throw new BadRequestError('Invalid Credentials');
// 		}

// 		// Simpan perubahan pada model User
// 		await checkUser.save();

// 		// Update data pada model Contact
// 		checkContact.name = name;
// 		checkContact.email = email;
// 		checkContact.phone = phone;
// 		checkContact.address.address = address;

// 		// Simpan perubahan pada model Contact
// 		await checkContact.save();
// 		// await Contact.findOneAndUpdate(
// 		// 	{ _id: checkUser.contact },
// 		// 	{ name, email },
// 		// 	{ new: true, runValidators: true }
// 		// );

// 		// Simpan perubahan pada model Address
// 		await Address.findOneAndUpdate(
// 			{ _id: checkContact.address._id },
// 			{ address },
// 			{ new: true, runValidators: true }
// 		);

// 		return checkUser;
// 	} catch (err) {
// 		throw err;
// 	}
// };


// const deleteCompany = async (req) => {
// 	const { id } = req.params;
// 	const result = await Users.findOne({
// 		_id: id,
// 	});

// 	if (!result) throw new NotFoundError(`Not found id :  ${id}`);
// 	await result.deleteOne();

// 	return { msg: "Deleted Successfully" }
// };

const deleteUser = async (req) => {
	const { id } = req.params;

	try {
		// Cari perusahaan berdasarkan field id
		const checkUser = await Users.findOne({ _id: id });
		const checkContact = await Contact.findOne({
			_id: checkUser.contact,
		}).populate('address');

		// Jika id tidak ditemukan, lempar error 'Not found id' kepada client
		if (!checkUser) throw new NotFoundError(`Not found id: ${id}`);

		await Address.findByIdAndRemove(checkContact.address);
		await Companies.findByIdAndRemove(checkUser.company);
		await Contact.findByIdAndRemove(checkUser.contact);
		await Images.findByIdAndRemove(checkUser.avatar);
		await Users.deleteOne({ _id: id });

		return { msg: 'Deleted Successfully' };
	} catch (err) {
		throw err;
	}
};

const checkingUser = async (id) => {
	const result = await Users.findOne({ _id: id });
	if (!result) throw new NotFoundError(id);
	return result;
};


module.exports = {
	getAllUsers,
	getAllUsers2,
	createUser,
	getDetailUser,
	updateUser,
	deleteUser,
	checkingUser,
	changeStatusUser,
};
