const dotenv = require('dotenv');
dotenv.config();

module.exports = {
	urlDb: process.env.URL_MONGODB_DEV,
	jwtSecret: process.env.JWT_SECRET,
	jwtExpiration: '1d',
	jwtRefreshTokenSecret: process.env.JWT_SECRET_REFRESH_TOKEN,
	jwtRefreshTokenExpiration: '2d',
	gmail: process.env.GMAIL,
	password: process.env.PASSWORD,
	emailHost: process.env.EMAIL_HOST,
	emailPort: process.env.EMAIL_PORT,
	emailCustom: process.env.EMAIL_USER,
	emailPassword: process.env.EMAIL_PASSWORD,

	// rootPath: path.resolve(__dirname, '..'),
	serviceName: process.env.SERVICE_NAME,

	// # Midtrans Config
	isProduction: false,
	ID_Merchant: 'G707719739',
	serverKey: 'SB-Mid-server-hXtRmMLFWpEo4pMRwuv41Egs',
	clientKey: 'SB-Mid-client-SHanFwCMsfGPGDxC',

	// # Tripay Config
	Kode_Merchant: 'T25139',
	Nama_Merchant: 'Merchant Sandbox',
	URL_Callback: '',
	API_Key: 'DEV - V36VvrUw6DRkDNbsOuWfqsXwtTibCblZzcc588qI',
	Private_Key: '5z9sS - EFZPC - Bzb5G - Gg6NW - uZG7I',
	Authorization: 'Bearer DEV - V36VvrUw6DRkDNbsOuWfqsXwtTibCblZzcc588qI'
};