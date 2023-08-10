const { UnauthenticatedError, UnauthorizedError } = require('../errors');
const { isTokenValid } = require('../utils/jwt');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const Users = require('../api/v1/users/model');

// with cookie
// const authenticateUser = async (req, res, next) => {
// 	let token;
// 	// check header
// 	const authHeader = req.headers.authorization;
// 	if (authHeader && authHeader.startsWith('Bearer')) {
// 		token = authHeader.split(' ')[1];
// 	}
// 	// check cookies
// 	else if (req.cookies.token) {
// 		token = req.cookies.token;
// 	}

// 	console.log('token');
// 	console.log(token);

// 	if (!token) throw new UnauthenticatedError('Authentication invalid');

// 	try {
// 		const payload = isTokenValid({ token });
// 		// Attach the user and his permissions to the req object
// 		req.user = {
// 			company: payload.company,
// 			email: payload.email,
// 			id: payload.userId,
// 			name: payload.name,
// 			role: payload.role,
// 		};

// 		next();
// 	} catch (error) {
// 		next(error);
// 	}
// };

// const authenticateUser = asyncHandler(async (req, res, next) => {
// 	let token;

// 	token = req.cookies.jwt;

// 	if (token) {
// 		try {
// 			const decoded = jwt.verify(token, process.env.JWT_SECRET);

// 			req.user = await Users.findById(decoded.userId).select('-password');

// 			next();
// 		} catch (error) {
// 			console.error(error);
// 			throw new CustomError.UnauthenticatedError('Authentication Invalid');
// 		}
// 	} else {
// 		throw new CustomError.UnauthenticatedError('Authentication Invalid');
// 	}

// 	if (!token) {

// 	}

// 	const { name, userId, role } = isTokenValid({ token });
// 	req.user = { name, userId, role };
// });

// no cookie, alias localStorage
const authenticateUser = async (req, res, next) => {
	try {
		let token;
		// check header
		const authHeader = req.headers.authorization;

		if (authHeader && authHeader.startsWith('Bearer')) {
			token = authHeader.split(' ')[1];
		}

		// console.log('token');
		// console.log(token);

		if (!token) {
			throw new UnauthenticatedError('Authentication invalid');
		}

		const payload = isTokenValid({ token });

		// Attach the user and his permissions to the req object
		req.user = {
			username: payload.username,
			name: payload.name,
			email: payload.email,
			role: payload.role,
			// company: payload.company,
			id: payload.userId,
		};

		next();
	} catch (error) {
		next(error);
	}
};

const authorizeRoles = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) throw new UnauthorizedError('Unauthorized to access this route');
		next();
	};
};


const authenticateCustomer = async (req, res, next) => {
	try {
		let token;
		// check header
		const authHeader = req.headers.authorization;

		if (authHeader && authHeader.startsWith('Bearer')) {
			token = authHeader.split(' ')[1];
		}

		if (!token) {
			throw new UnauthenticatedError('Authentication invalid');
		}

		const payload = isTokenValid({ token });

		// Attach the user and his permissions to the req object
		req.customer = {
			email: payload.email,
			lastName: payload.lastName,
			firstName: payload.firstName,
			id: payload.customerId,
		};

		next();
	} catch (error) {
		next(error);
	}
};

module.exports = { authenticateUser, authorizeRoles, authenticateCustomer };
