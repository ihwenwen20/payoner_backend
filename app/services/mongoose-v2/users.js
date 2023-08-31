const Users = require('../../api/v2/users/model');
const Contact = require('../../api/v2/contacts/model')
const { checkingImage, createImages } = require('./images');
const { deleteCompany } = require('./companies');
const { checkingContact, createContact, updateContact, deleteContact } = require('./contact');
const { NotFoundError, BadRequestError, DuplicateError } = require('../../errors');
const { paginate } = require('../../utils/paginationUtils');

const getAllUsers = async (req, queryFields, search, page, size) => {
	console.log('token', req.user)
	let condition = {};
	// let condition = { _id: req.user.id };
	const result = await paginate(Users, queryFields, search, page, size, filter = condition);
	const populateOptions = [
		{
			path: 'companies',
			select: 'companyName email',
		},
		{
			path: 'contact',
			select: 'phone',
			// populate: 'addressId'
			populate: {
				path: 'addressId',
				select: 'address',
			},
		},
		{
			path: 'avatar',
			select: 'url',
		}
	];
	const userQuery = Users.find(condition)
		.select('-password -otp ')

	const userData = await userQuery.lean().exec();
	await Users.populate(userData, populateOptions);
	result.data = userData;
	// await Users.populate(result.data, populateOptions);
	return result;
};

const createUser = async (req, res) => {
	const { username, name, email, password, confirmPassword, } = req.body;
	if (!username || !name || !email || !password || !confirmPassword) throw new NotFoundError(username, name, email, password, confirmPassword, companyName,);
	if (password !== confirmPassword) throw new BadRequestError("Password and Confirm Password do not match");

	const check = await Users.findOne({ username, email });
	if (check) throw new DuplicateError(username, email);
	const avatars = await createImages(req)
	const contacts = await createContact(req)

	const result = await Users.create({
		...req.body, avatar: avatars.data._id,
		contact: contacts.data._id
	});
	if (!result || result.length === 0 || !result.contact || result.contact.length === 0) {
		console.log("User or user's contact is empty");
		await Contact.findByIdAndDelete(contacts.data._id);
		await result.deleteOne();
		throw new BadRequestError("Invalid Contact Data.");
	};

	delete result._doc.password;
	delete result._doc.otp;

	return { msg: "Users created successfully", data: result };
};

const getDetailUser = async (req) => {
	const { id } = req.params;
	const result = await Users.findOne({
		_id: id,
		// role: req.user.role
	})
		.populate({
			path: 'companies',
		})
		.populate({
			path: 'contact',
			populate: 'addressId'
		})
		// .populate({
		// 	path: 'contact',
		// 	select: 'addressId'
		// })
		.populate({
			path: 'avatar',
			select: 'url'
		})
	if (!result) throw new NotFoundError(id);
	delete result._doc.password;
	delete result._doc.otp;
	return result;
};

const updateUser = async (req) => {
	const { id } = req.params;
	const { password, confirmPassword, } = req.body;
	if (password !== confirmPassword) throw new BadRequestError("Password and Confirm Password do not match");

	const checkUser = await checkingUser(id)
	console.log('checkUser', checkUser)
	const avatars = await checkingImage(checkUser.avatar)
	const checkContact = await checkingContact(checkUser.contact)
	console.log('checkContact', checkContact)
	const check = await Users.findOne({
		username: checkUser.username,
		email: checkUser.email,
		_id: { $ne: id },
	});
	// const check = await checkingUser(id, {
	// 	email: checkUser.email,
	// 	username: checkUser.username,
	// 	excludeId: true,
	// });
	console.log('cek', check)
	if (check) throw new DuplicateError(username, email);
	const contacts = await updateContact(checkUser.contact, req.body)
	console.log('contacs', contacts)
	const result = await Users.findOneAndUpdate(
		{ _id: id },
		{
			...req.body, contact: contacts.data._id,
			avatar: avatars._id,
		},
		{ new: true, runValidators: true }
	);
	if (!result) throw new BadRequestError('Updated User Failed.');

	delete result._doc.password;
	delete result._doc.otp;

	return { msg: "Updated Data Successfully", data: result };
};


const deleteUser = async (req) => {
	const { id } = req.params;
	if (id === req.user.userId || id === req.user.owner || id === req.user.companyId) throw new BadRequestError('Warning!!! You cannot delete yourself.');

	const result = await checkingUser(id);
	console.log('res delete', result);
	// const avatars = await checkingImage(result.avatar)
	const contacts = await checkingContact(result.contact)
	// await result.deleteOne({ _id: id });
	// await avatars.deleteOne();
	await contacts.deleteOne();

	// Hapus semua company yang terkait dengan pengguna
	for (const companyId of result.companies) {
		// await Companies.findByIdAndDelete(companyId);
		await deleteCompany(companyId, req)
	}
	await result.deleteOne();

	delete result._doc.password;
	delete result._doc.otp;

	return { msg: 'User and Associated Companies Deleted Successfully', data: result };
};

const checkingUser = async (id, options = {}) => {
	const query = {
		_id: id,
		...options,
	};

	if (options.excludeId) {
		query._id = { $ne: id };
		console.log('duplicate users false')
	}
	const result = await Users.findOne(query);
	if (!result) throw new NotFoundError(id);
	return result;
};

const changeStatusUser = async (req) => {
	console.log('token', req.user)
	const { id } = req.params;
	const secret = await Users.findOne({
		role: 'Developer'
	});
	if (!secret) throw new UnauthorizedError('Bro, Lu mau ngapain hah :D ketauan kan... wkwk');

	const { status } = req.body;
	await checkingUser(id);
	if (!['Active', 'Inactive', 'Pending', 'Suspend', 'Free'].includes(status)) throw new BadRequestError('Status must type is required');

	const result = await Users.findOneAndUpdate(
		{ _id: id },
		{ status },
		{ new: true, runValidators: true }
	)
	if (!result) throw new BadRequestError('Updated Status User Failed');
	delete result._doc.password;
	delete result._doc.otp;
	return { msg: `Success! Now, Status ${result.name} is ${result.status}.`, data: result };
};

module.exports = {
	getAllUsers,
	createUser,
	getDetailUser,
	updateUser,
	deleteUser,
	checkingUser,
	changeStatusUser,
};


// 		// Cek apakah ada pengguna lain dengan email yang sama
// 		// const checkEmail = await Users.findOne({
// 		//   email: email.toLowerCase(),
// 		//   _id: { $ne: id },
// 		// });
// 		// if (checkEmail) throw new BadRequestError(`${email} already exists`);

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
// const updateUser = async (req) => {
// 	const { id } = req.params;
// 	const { avatar, name, email, role, password, confirmPassword, gender, birthday, status, companyName, phone, address } = req.body;

// 	try {
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

// 		// Cari pengguna lain yang memiliki data perusahaan yang sama
// 		const checkEmail = await Users.findOne({
// 			email,
// 			_id: { $ne: id },
// 		});
// 		// Jika email pengguna dengan data perusahaan yang sama ditemukan, lempar error bad request
// 		if (checkEmail) throw new BadRequestError(`${email} already exists`);

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
// 		checkCompany.companyName = companyName;
// 		checkContact.name = name;
// 		checkContact.email = email;
// 		checkContact.phone = phone;
// 		checkContact.address.address = address;

// 		if (password && password !== confirmPassword) throw new BadRequestError('Invalid Credentials');

// 		await Promise.all([
// 			checkUser.save(),
// 			checkCompany.save(),
// 			checkContact.save(),
// 			Address.findOneAndUpdate(
// 				{ _id: checkContact.address._id },
// 				{ address },
// 				{ new: true }
// 			),
// 		]);

// 		return checkUser;
// 	} catch (err) {
// 		throw err;
// 	}
// };