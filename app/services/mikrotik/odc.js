const ODC = require('../../api/v1/mikrotik/odc/model');
const { checkingCoverage } = require('../mongoose/coverage');
const { NotFoundError, BadRequestError } = require('../../errors');

const getAllODCs = async () => {
	const result = await ODC.find();
	return result;
};

const createODC = async (req) => {
	const {
		odcCode,
		oltPortNumber,
		totalPort,
		tubeFoColor,
		poleNumber,
		photo,
		description,
		publisher,
		coverage
	} = req.body;

	const existingODC = await ODC.findOne({ odcCode });
	if (existingODC) {
		throw new BadRequestError('ODC with the provided code already exists');
	}

	try {
		await checkingCoverage(coverage);

		const newODC = new ODC({
			odcCode,
			oltPortNumber,
			totalPort,
			tubeFoColor,
			poleNumber,
			photo,
			description,
			publisher,
			coverage,
		});

		const savedODC = await newODC.save();
		return savedODC;
	} catch (err) {
		throw err
	}
};

const getODCById = async (id) => {
	const odc = await ODC.findById(id)
		.populate({
			path: 'coverage',
			populate: ({
				path: 'address',
				// select: 'geo'
			})
		});
	if (!odc) {
		throw new NotFoundError(`ODC with ID: ${id} not found`);
	}
	return odc;
};

const updateODC = async (id, updateData) => {
	const odc = await ODC.findById(id);
	if (!odc) {
		throw new NotFoundError(`ODC with ID: ${id} not found`);
	}


	const { odcCode, oltPortNumber, totalPort, tubeFoColor, poleNumber, photo, description, publisher, coverage } = updateData;
	await checkingCoverage(coverage);

	odc.odcCode = odcCode;
	odc.oltPortNumber = oltPortNumber;
	odc.totalPort = totalPort;
	odc.tubeFoColor = tubeFoColor;
	odc.poleNumber = poleNumber;
	odc.photo = photo;
	odc.description = description;
	odc.publisher = publisher;
	odc.coverage = coverage;

	const updatedODC = await odc.save();
	return updatedODC;
};

const deleteODC = async (id) => {
	const odc = await ODC.findByIdAndDelete(id);
	if (!odc) {
		throw new NotFoundError(`ODC with ID: ${id} not found`);
	}

	return { msg: "Deleted Successfully" }
};

const checkingODC = async (id) => {
	const result = await ODC.findOne({ _id: id });
	if (!result) throw new NotFoundError(`ODC with id :  ${id} Not Found`);
	return result;
};

module.exports = {
	getAllODCs,
	createODC,
	getODCById,
	updateODC,
	deleteODC,
	checkingODC,
};
