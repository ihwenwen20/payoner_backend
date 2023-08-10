const dotenv = require('dotenv');
dotenv.config();

module.exports = {
	urlDb: process.env.URL_MONGODB_DEV,
	jwtSecret: process.env.JWT_SECRET,
	jwtExpiration: '7d',
	jwtRefreshTokenSecret: process.env.JWT_SECRET_REFRESH_TOKEN,
	jwtRefreshTokenExpiration: '7d',
	gmail: process.env.GMAIL,
	password: process.env.PASSWORD,
	emailHost: process.env.EMAIL_HOST,
	emailPort: process.env.EMAIL_PORT,
	emailCustom: process.env.EMAIL_USER,
	emailPassword: process.env.EMAIL_PASSWORD,

	// rootPath: path.resolve(__dirname, '..'),
  serviceName: process.env.SERVICE_NAME,
};