const Coverage = require('../../api/v2/coverage/model');
const Address = require('../../api/v2/address/model');
const { NotFoundError, BadRequestError } = require('../../errors');

const getAllCoverages = async () => {
	const result = await Coverage.find({});
	return result;
};

const createCoverage = async (req) => {
	const { areaName, description, status, radius, codeArea, publisher, address, desa, kecamatan, city, zipcode, province, country, latitude, longitude } = req.body
	if (!areaName || !address || !description || !status || !radius || !codeArea || !publisher) {
		throw new BadRequestError("Please provide all required fields");
	}

	const check = await Coverage.findOne({ areaName, codeArea });
	if (check) {
		throw new BadRequestError("Area Name and Area Code already exists");
	}

	try {
		const newAddress = await Address.create({
			address,
			desa,
			kecamatan,
			city,
			zipcode,
			province,
			country,
			geo: {
				latitude,
				longitude,
			},
		});

		const newArea = new Coverage({
			areaName, description, status, radius, codeArea, publisher,
			address: newAddress._id,
		});
		const savedArea = await newArea.save();
		return savedArea;
	} catch (err) {
		throw err
	}
};

const getOneCoverage = async (id) => {
	const result = await Coverage.findOne({
		_id: id,
	}).populate({
		path: 'address',
	});

	if (!result) throw new NotFoundError(`No value Coverage with id :  ${id}`);

	return result;
};

const updateCoverage = async (id, updateData) => {
	const { areaName, description, status, radius, codeArea, publisher, address, desa, kecamatan, city, zipcode, province, country, latitude, longitude } = updateData;

	try {
		const coverage = await Coverage.findById(id);

		if (!coverage) {
			throw new NotFoundError(`Coverage dengan ID: ${id} tidak ditemukan`);
		}
		// cari Coverage dengan field name dan id selain dari yang dikirim dari params
		const check = await Coverage.findOne({
			areaName, codeArea,
			_id: { $ne: id },
		});

		// apa bila check true / data Coverage sudah ada maka kita tampilkan error bad request dengan message Duplicate value Coverage Name
		if (check) throw new BadRequestError('Duplicate value Coverage Name');


		// Perbarui bidang coverage
		coverage.areaName = areaName;
		coverage.description = description;
		coverage.status = status;
		coverage.radius = radius;
		coverage.codeArea = codeArea;
		coverage.publisher = publisher;

		// Temukan alamat terkait berdasarkan ID
		const addressObj = await Address.findById(coverage.address);

		if (!addressObj) {
			throw new NotFoundError(`Alamat dengan ID: ${coverage.address} tidak ditemukan`);
		}

		// Perbarui bidang alamat
		addressObj.address = address;
		addressObj.desa = desa;
		addressObj.kecamatan = kecamatan;
		addressObj.city = city;
		addressObj.zipcode = zipcode;
		addressObj.province = province;
		addressObj.country = country;
		addressObj.geo.latitude = latitude;
		addressObj.geo.longitude = longitude;

		// Simpan perubahan pada alamat
		await addressObj.save();

		// Simpan perubahan pada coverage
		const savedCoverage = await coverage.save();

		return savedCoverage;
	} catch (error) {
		throw error;
	}
};


const deleteCoverage = async (id) => {
	const result = await Coverage.findByIdAndDelete(id);

	if (!result) throw new NotFoundError(`No value Coverage with id :  ${id}`);

	return { msg: "Deleted Successfully" }
};

const checkingCoverage = async (id) => {
	const result = await Coverage.findOne({ _id: id });

	if (!result) throw new NotFoundError(`Area with id :  ${id} Not Found`);

	return result;
};

module.exports = {
	getAllCoverages,
	createCoverage,
	getOneCoverage,
	updateCoverage,
	deleteCoverage,
	checkingCoverage,
};
