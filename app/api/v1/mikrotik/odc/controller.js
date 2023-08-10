const { StatusCodes } = require('http-status-codes');
const {
	getAllODCs,
	createODC,
	getODCById,
	updateODC,
	deleteODC,
} = require('../../../../services/mikrotik/odc');

const index = async (req, res, next) => {
	try {
		const result = await getAllODCs(req);
		res.status(StatusCodes.OK).json({
			data: result,
		});
	} catch (error) {
		next(error);
	}
};

const create = async (req, res, next) => {
	try {
		const odc = await createODC(req);
		res.status(StatusCodes.CREATED).json({ data: odc });
	} catch (error) {
		next(error);
	}
};

const find = async (req, res, next) => {
	try {
		const { id } = req.params;
		const odc = await getODCById(id);
		res.status(StatusCodes.OK).json({ data: odc });
	} catch (error) {
		next(error);
	}
};

const update = async (req, res, next) => {
	try {
		const { id } = req.params;
		const odc = await updateODC(id, req.body);
		res.status(StatusCodes.OK).json({ data: odc });
	} catch (error) {
		next(error);
	}
};

const destroy = async (req, res, next) => {
	try {
		const { id } = req.params;
		const result = await deleteODC(id);
		res.status(StatusCodes.OK).json({ data: result });
	} catch (error) {
		next(error);
	}
};

module.exports = {
	index,
	create,
	find,
	update,
	destroy,
};
