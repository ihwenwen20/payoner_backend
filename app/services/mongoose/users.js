const Users = require('../../api/v1/users/model');
const Companies = require('../../api/v1/companies/model');
const Contact = require('../../api/v1/contacts/model');
const Address = require('../../api/v1/address/model');
const Images = require('../../api/v1/images/model');
const { checkingImage, createImages } = require('./images');

const { NotFoundError, BadRequestError } = require('../../errors');

const getAllCompanies = async (req) => {
	// const { page = 0, limit = 10, startDate, endDate} = req.query;
	const page = parseInt(req.query.page) || 0;
	const limit = parseInt(req.query.limit) || 10;
	const search = req.query.search_query || "";
	const offset = limit * page;

	const totalRows = await Users.countDocuments();
	const totalPage = Math.ceil(totalRows / limit);

	const result = await Users.find({
		$or: [
			{ name: { $regex: search, $options: 'i' } },
			{ email: { $regex: search, $options: 'i' } }
		]
	}).populate({
		path: 'company',
		select: 'companyName',
	})
		.populate({
			path: 'contact',
			select: 'phone address',
		})
		.populate({
			path: 'avatar',
			select: '_id url',
		})
		.lean()
		.skip(offset)
		// .skip(limit * (page - 1))
		.limit(limit)
		.sort({ _id: -1 });;

	return {
		result,
		page,
		limit,
		totalRows,
		totalPage,
	};
};

const createCompany = async (req, res) => {
	const { avatar, name, email, role, password, confirmPassword, gender, birthday, status, companyName, phone, address } = req.body;

	if (!name || !companyName || !email || !password || !confirmPassword) throw new BadRequestError("Please provide all required fields");
	if (password !== confirmPassword) throw new BadRequestError("Password and Confirm Password do not match");

	const existingUser = await Users.findOne({ email });
	if (existingUser) throw new BadRequestError(`User with this email: ${email} already exists`);

	try {
		const result = await Companies.create({ companyName });
		const newAddress = await Address.create({
			address,
			// desa,
			// kecamatan,
			// city,
			// zipcode,
			// province,
			// country,
			// geo: {
			// 	latitude,
			// 	longitude,
			// },
		});
		const contact = await Contact.create({ name, email, phone, address: newAddress._id, });
		const avatar = await createImages(req);
		const users = await Users.create({
			name,
			email,
			password,
			role,
			avatar: avatar._id,
			gender, birthday, status,
			company: result._id,
			contact: contact._id,
		});

		delete users._doc.password;

		return users;
	} catch (err) {
		throw err
	}

};

const changeStatusCompanies = async (req) => {
	const { id } = req.params;
	const { status } = req.body;

	if (!['active', 'pending', 'not active'].includes(status)) throw new BadRequestError('Status must type is required');

	// cari Company berdasarkan field id
	const checkCompany = await Users.findOneAndUpdate(
		{ _id: id },
		{ status, },
		{ new: true, runValidators: true }
	);

	// jika id result false / null maka akan menampilkan error `Not found id` yang dikirim client
	if (!checkCompany) throw new NotFoundError(`Not found id :  ${id}`);
	return checkCompany;
};

const getDetailsCompany = async (req) => {
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
const updateCompany = async (req) => {
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

const deleteCompany = async (req) => {
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


module.exports = {
	getAllCompanies,
	createCompany,
	changeStatusCompanies,
	getDetailsCompany,
	updateCompany,
	deleteCompany
};
