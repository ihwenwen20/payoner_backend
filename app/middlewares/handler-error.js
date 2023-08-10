const {StatusCodes} = require('http-status-codes');
const errorHandlerMiddleware = (err, req, res, next) => {
	console.log('err');
	console.log(err.message);

	let customError = {
		// set default
		statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
		msg: err.message || 'Something went wrong try again later',
	};

	// error validation dari mongoose
	// if ini untuk error yang masuk ke catch
	if (err.name === 'ValidationError') {
		customError.data = Object.values(err.errors)
			.map((item) => item.message)
			.join(', ');
		customError.statusCode = 400;
	}

	if (err.code && err.code === 11000) {
		customError.data = `Duplicate value entered for ${Object.keys(
			err.keyValue
		)} field, please choose another value`;
		customError.statusCode = 400;
	}

	if (err.name === 'CastError') {
		customError.msg = `Value item with id : ${err.value}, Not found`;
		customError.statusCode = 404;
	}

	return res.status(customError.statusCode).json({data: customError});
};

module.exports = errorHandlerMiddleware;