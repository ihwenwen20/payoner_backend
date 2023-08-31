const { StatusCodes } = require('http-status-codes');

const { createImages } = require('../../../services/mongoose-v2/images');

const create = async (req, res, next) => {
	try {
		const { msg, data } = await createImages(req);
		res.status(StatusCodes.CREATED).json({ msg, data });
	} catch (err) {
		next(err);
	}
};

module.exports = { create };