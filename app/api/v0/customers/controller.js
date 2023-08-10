const {
	signupCustomer,
	activateCustomer,
	signinCustomer,
	getAllServices,
	getOneService,
	getAllOrders,
	checkoutOrder,
	getAllPaymentByCompany,
} = require('../../../services/mongoose/customers');

const {StatusCodes} = require('http-status-codes');

const signup = async (req, res, next) => {
	try {
		const result = await signupCustomer(req);

		res.status(StatusCodes.CREATED).json({
			data: result,
		});
	} catch (err) {
		next(err);
	}
};

const activeCustomer = async (req, res, next) => {
	try {
		const result = await activateCustomer(req);

		res.status(StatusCodes.OK).json({
			data: result,
		});
	} catch (err) {
		next(err);
	}
};

const signin = async (req, res, next) => {
	try {
		const result = await signinCustomer(req);

		res.status(StatusCodes.OK).json({
			data: {token: result},
		});
	} catch (err) {
		next(err);
	}
};

const landingPage = async (req, res, next) => {
	try {
		const result = await getAllServices(req);

		res.status(StatusCodes.OK).json({
			data: result,
		});
	} catch (err) {
		next(err);
	}
};

const getDashboard = async (req, res, next) => {
	try {
		const result = await getAllOrders(req);

		res.status(StatusCodes.OK).json({
			data: result,
		});
	} catch (err) {
		next(err);
	}
};

const detailPage = async (req, res, next) => {
	try {
		const result = await getOneService(req);

		res.status(StatusCodes.OK).json({
			data: result,
		});
	} catch (err) {
		next(err);
	}
};

const getAllPayment = async (req, res, next) => {
	try {
		const result = await getAllPaymentByCompany(req);

		res.status(StatusCodes.OK).json({
			data: result,
		});
	} catch (err) {
		next(err);
	}
};

const checkout = async (req, res, next) => {
	try {
		const result = await checkoutOrder(req);

		res.status(StatusCodes.CREATED).json({
			data: result,
		});
	} catch (err) {
		next(err);
	}
};

module.exports = {
	signup,
	activeCustomer,
	signin,
	landingPage,
	detailPage,
	getDashboard,
	checkout,
	getAllPayment,
};
