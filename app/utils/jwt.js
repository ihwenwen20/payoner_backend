const jwt = require('jsonwebtoken');
const {
	jwtSecret,
	jwtExpiration,
	jwtRefreshTokenExpiration,
	jwtRefreshTokenSecret,
} = require('../config');

const createJWT = ({ payload }) => {
	const token = jwt.sign(payload, jwtSecret, {
		expiresIn: jwtExpiration,
		// expiresIn: '2days',
	});
	return token;
};

const createRefreshJWT = ({ payload }) => {
	const token = jwt.sign(payload, jwtRefreshTokenSecret, {
		expiresIn: jwtRefreshTokenExpiration,
	});
	return token;
};

const isTokenValid = ({ token }) => jwt.verify(token, jwtSecret);

const isTokenValidRefreshToken = ({ token }) => jwt.verify(token, jwtRefreshTokenSecret)

const attachCookiesToResponse = ({ res, req }) => {
	// const token = createJWT({ payload: user });
	const oneDay = 1000 * 60 * 60 * 24;

	// res.cookie('refreshToken', token, {
	res.cookie('refreshToken', {
		httpOnly: true,
		maxAge: new Date(Date.now() + oneDay),
		secure: process.env.MODE !== 'development', // Use secure cookies in production
    sameSite: 'strict', // Prevent CSRF attacks
		signed: true,
	});
	// return token
	return
};

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, jwtSecret, {
    expiresIn: '30d',
  });

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.MODE !== 'development', // Use secure cookies in production
    sameSite: 'strict', // Prevent CSRF attacks
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

module.exports = {
	createJWT,
	isTokenValid,
	isTokenValidRefreshToken,
	createRefreshJWT,
	attachCookiesToResponse,
	generateToken
};
