const jwt = require('jsonwebtoken');
const {
	jwtSecret,
	jwtExpiration,
	jwtRefreshTokenExpiration,
	jwtRefreshTokenSecret,
} = require('../config');
const UserRefreshToken = require('../api/v2/userRefreshToken/model');


const createJWT = ({ payload }) => {
	const token = jwt.sign(payload, jwtSecret, {
		expiresIn: jwtExpiration,
		// expiresIn: '30d',
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
    expiresIn: jwtExpiration,
  });

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.MODE !== 'development', // Use secure cookies in production
    sameSite: 'strict', // Prevent CSRF attacks
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

const generateResetToken = (userId) => {
  const token = jwt.sign({ sub: userId }, jwtRefreshTokenSecret, {
    expiresIn: jwtRefreshTokenExpiration,
  });
  return token;
};

const storeResetToken = async (userId, resetToken) => {
  await UserRefreshToken.create({ user: userId, refreshToken: resetToken });
};

const sendPasswordResetEmail = (email, resetToken) => {
  // Mengirim email menggunakan layanan email eksternal
  // Contoh implementasi: emailService.sendEmail(email, "Reset Password", `Click this link to reset your password: ${resetToken}`);
};

const validateResetToken = async (token) => {
  try {
    const decodedToken = jwt.verify(token, jwtRefreshTokenSecret);
    const userId = decodedToken.sub;

    // Cek apakah token terkait dengan userId dalam database
    const resetTokenFromDB = await UserRefreshToken.findOne({ user: userId, refreshToken: token });
    if (!resetTokenFromDB) throw new Error("Invalid reset token");

    return userId;
  } catch (error) {
    throw new Error("Invalid reset token");
  }
};

const clearResetToken = async (userId, token) => {
  // Hapus token dari database berdasarkan userId dan refreshToken
  await UserRefreshToken.findOneAndDelete({ user: userId, refreshToken: token });
};

module.exports = {
	createJWT,
	isTokenValid,
	isTokenValidRefreshToken,
	createRefreshJWT,
	attachCookiesToResponse,
	generateToken,
	generateResetToken,

  storeResetToken,
  sendPasswordResetEmail,
  validateResetToken,
  clearResetToken,
};
