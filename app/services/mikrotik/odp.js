// import model ODP
const ODP = require('../../api/v1/mikrotik/odp/model');
const { checkingODC } = require('./odc');
const { NotFoundError, BadRequestError } = require('../../errors');

const getAllODP = async () => {
	const result = await ODP.find()
		.populate({
			path: 'odcCode',
			select: 'odcCode'
		});;
	return result;
};

const createODP = async (req) => {
	const { odpCode, odcCode, ...rest } = req.body;

	// Cek apakah ODC dengan odcCode tersedia
	await checkingODC(odcCode);

	const checkODP = await ODP.findOne({ odpCode });
	if (checkODP) {
		throw new BadRequestError('ODP with the same odcCode already exists');
	}

	const odp = new ODP({
		odpCode,
		// odcCode: odc._id,
		odcCode,
		...rest,
	});

	await odp.validate();
	try {

		const result = await odp.save();
		return result;
	} catch (err) {
		throw new NotFoundError(`Not found value`);
	}
};

const getOneODP = async (req) => {
	const { id } = req.params;
	try {
		const result = await ODP.findById(id).populate({
			path: 'odcCode',
			populate: ({ path: 'coverage', populate: ({ path: 'address' }) })
		});
		return result;
	} catch (err) {
		throw new NotFoundError(`No ODP with id: ${id}`);
	}

};

const updateODP = async (req) => {
	const { id } = req.params;
	const { odcCode, odpCode, oltPortNumber, totalPort, tubeFoColor, poleNumber, photo, description, publisher } = req.body;

	// Cek apakah ODC dengan odcCode tersedia
	await checkingODC(odcCode);

	const checkODP = await ODP.findOne({
		_id: id
	});
	if (!checkODP) throw new NotFoundError(`ODP with id: ${id}, Not found`);

	const check = await ODP.findOne({
		odpCode,
	});
	if (check) throw new BadRequestError(`ODP already exists`);

	const updatedODP = await ODP.findOneAndUpdate(
		{ _id: id },
		{ odcCode, odpCode, oltPortNumber, totalPort, tubeFoColor, poleNumber, photo, description, publisher },
		{ new: true, runValidators: true }
	);

	return updatedODP;
};

const deleteODP = async (req) => {
	const { id } = req.params;
	try {
		const odp = await ODP.findByIdAndDelete(id);
		await odp.deleteOne();
		return { msg: "Deleted Successfully" };
	} catch (err) {
		throw new NotFoundError(`No ODP with id: ${id}`);
	}
};


module.exports = {
	getAllODP,
	createODP,
	getOneODP,
	updateODP,
	deleteODP,
};