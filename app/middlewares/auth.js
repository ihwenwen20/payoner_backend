const { UnauthenticatedError, UnauthorizedError } = require('../errors');
const { isTokenValid } = require('../utils/jwt');
const jwt = require('jsonwebtoken');
const {
	jwtSecret,
	jwtExpiration,
	jwtRefreshTokenExpiration,
	jwtRefreshTokenSecret,
} = require('../config');
const Users = require('../api/v2/users/model');
const Companies = require('../api/v2/companies/model');

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

		const payload = jwt.verify(token, jwtSecret);
		// console.log('payload', payload)

		// const companyId = payload.companyId ? payload.companyId[0] : null;
		// const companiesIds = payload.companies.map(company => company._id);
		// const userCompanies = await Companies.find({});
		// console.log('userCompanies', userCompanies)
		// Attach the user and his permissions to the req object
		req.user = {
			id: payload.userId,
			// username: payload.username,
			// name: payload.name,
			// email: payload.email,
			// role: payload.role,
			userId: payload.userId,
			username: payload.username,
			ownerName: payload.ownerName,
			ownerEmail: payload.ownerEmail,
			ownerRole: payload.ownerRole,
			companyId: payload.companyId,
			// companyId: companyId,
			name: payload.name,
			email: payload.email,
			role: payload.role,
			// companies: userCompanies.map(company => company._id),
			// companies: payload.companies,
		};

		next();
	} catch (error) {
		next(error);
	}
};

const authenticateCompany = async (req, res, next) => {
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
		console.log('payload', payload)

		const isCompany = !!payload.companyId;

		if (isCompany) {
			req.isCompany = true;
		}

		// Attach the user and his permissions to the req object
		// req.company = {
		// 	id: payload.companyId,
		// 	name: payload.name,
		// 	email: payload.email,
		// 	role: payload.role,
		// 	owner: payload.owner,
		// };

		req.user = {
			userId: payload.userId,
			username: payload.username,
			ownerName: payload.ownerName,
			ownerEmail: payload.ownerEmail,
			ownerRole: payload.ownerRole,
			companyId: payload.companyId,
			name: payload.name,
			email: payload.email,
			role: payload.role,
			owner: payload.owner,
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

// const authorizeRolesCompany = (...roles) => {
// 	return (req, res, next) => {
// 		if (!roles.includes(req.user.role)) throw new UnauthorizedError('Unauthorized to access this route');
// 		next();
// 	};
// };

const authorizeRolesCompany = (...roles) => {
	return (req, res, next) => {
			if (req.isCompany) {
					// Company-specific authorization logic
					if (!roles.includes(req.user.ownerRole)) {
							throw new UnauthorizedError('Unauthorized to access this route');
					}
			} else {
					// User-specific authorization logic
					if (!roles.includes(req.user.role)) {
							throw new UnauthorizedError('Unauthorized to access this route');
					}
			}
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

module.exports = { authenticateUser, authorizeRoles, authenticateCustomer, authenticateCompany, authorizeRolesCompany };
