// const {
// 	getAllRoles,
// 	getOneRoles,
// 	updateRoles,
// 	createRoles,
// 	deleteRoles,
// } = require('../../../services/mongoose/roles');

// const {StatusCodes} = require('http-status-codes');

// const create = async (req, res, next) => {
// 	try {
// 		// const { role, permissions } = req.body;
//     const result = await createRoles(req);

// 		res.status(StatusCodes.CREATED).json({
// 			data: result,
// 		});
// 	} catch (err) {
// 		next(err);
// 	}
// };

// const index = async (req, res, next) => {
// 	try {
// 		const result = await getAllRoles();

// 		res.status(StatusCodes.OK).json({
// 			data: result,
// 		});
// 	} catch (err) {
// 		console.log(err);
// 		next(err);
// 	}
// };

// const find = async (req, res, next) => {
// 	try {
// 		const result = await getOneRoles(req);

// 		res.status(StatusCodes.OK).json({
// 			data: result,
// 		});
// 	} catch (err) {
// 		next(err);
// 	}
// };

// const update = async (req, res, next) => {
// 	try {
// 		// const { roleId } = req.params;
//     // const { permissions } = req.body;
// 		const result = await updateRoles(req);

// 		res.status(StatusCodes.OK).json({
// 			data: result,
// 		});
// 	} catch (err) {
// 		next(err);
// 	}
// };

// const destroy = async (req, res, next) => {
// 	try {
// 		// const { roleId } = req.params;
// 		const result = await deleteRoles(req);
// 		res.status(StatusCodes.OK).json({
// 			data: result,
// 		});
// 	} catch (err) {
// 		next(err);
// 	}
// };

// const {
// 	getAllPermissions,
// 	getOnePermissions,
// 	updatePermissions,
// 	createPermissions,
// 	deletePermissions,
// } = require('../../../services/mongoose/permissions');

// const {StatusCodes} = require('http-status-codes');

// const create = async (req, res, next) => {
// 	try {
// 		const result = await createPermissions(req);

// 		res.status(StatusCodes.CREATED).json({
// 			data: result,
// 		});
// 	} catch (err) {
// 		next(err);
// 	}
// };

// const index = async (req, res, next) => {
// 	try {
// 		const result = await getAllPermissions(req);

// 		res.status(StatusCodes.OK).json({
// 			data: result,
// 		});
// 	} catch (err) {
// 		console.log(err);
// 		next(err);
// 	}
// };

// const find = async (req, res, next) => {
// 	try {
// 		const result = await getOnePermissions(req);

// 		res.status(StatusCodes.OK).json({
// 			data: result,
// 		});
// 	} catch (err) {
// 		next(err);
// 	}
// };

// const update = async (req, res, next) => {
// 	try {
// 		const result = await updatePermissions(req);

// 		res.status(StatusCodes.OK).json({
// 			data: result,
// 		});
// 	} catch (err) {
// 		next(err);
// 	}
// };

// const destroy = async (req, res, next) => {
// 	try {
// 		const result = await deletePermissions(req);

// 		res.status(StatusCodes.OK).json({
// 			data: result,
// 		});
// 	} catch (err) {
// 		next(err);
// 	}
// };

// module.exports = {
// 	index,
// 	find,
// 	update,
// 	destroy,
// 	create,
// };

// module.exports = {
// 	index,
// 	find,
// 	update,
// 	destroy,
// 	create,
// };