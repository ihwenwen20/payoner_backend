const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const session = require('express-session')
const MongoStore = require("connect-mongo")
const { urlDb } = require('./app/config');

const app = express();
// const sessionStore = MongoStore.create({
// 	mongoUrl: urlDb,
// 	ttl: 20000,
// });

// // import router
// const addressRouter = require('./app/api/v2/address/router');
// const contactRouter = require('./app/api/v2/contacts/router');
// const coveragesRouter = require('./app/api/v2/coverage/router');
// const odcRouter = require('./app/api/v2/mikrotik/odc/router');
// const odpRouter = require('./app/api/v2/mikrotik/odp/router');
// const banksRouter = require('./app/api/v2/bank/router');
// const userRefreshTokenRouter = require('./app/api/v2/userRefreshToken/router');
// const companiesRouter = require('./app/api/v2/companies/router');
const authCMSRouter = require('./app/api/v2/auth/router');
const categoriesRouter = require('./app/api/v2/categories/router');
const usersRouter = require('./app/api/v2/users/router');
const imagesRouter = require('./app/api/v2/images/router');

// middleware
const notFoundMiddleware = require('./app/middlewares/not-found');
const handleErrorMiddleware = require('./app/middlewares/handler-error');

// app.use(session({
// 	secret: process.env.JWT_SECRET,
// 	resave: false,
// 	saveUninitialized: true,
// 	store: sessionStore,
// 	cookie: {
// 		secure: 'auto', signed: true, sameSite: "strict", httpOnly: true, // atau 'auto'
// 	}
// }));
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
// app.use(cors());
app.use(logger('dev'));
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, 'public')));

// /* GET home page. */
// app.get('/', (req, res) => {
// 	res.status(200).json({
// 		message: 'Hello from payoner api..',
// 	});
// });

// if (process.env.MODE === 'production') {
// 	const __dirname = path.resolve();
// 	app.use(express.static(path.join(__dirname, '/frontend/dist')));

// 	app.get('*', (req, res) =>
// 		res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
// 	);
// } else {
// 	app.get('/', (req, res) => {
// 		res.send('API is running....');
// 	});
// }

const v1 = '/api/users'

// use router
// app.use(addressRouter);
// app.use(contactRouter);
// app.use(coveragesRouter);
// app.use(odcRouter);
// app.use(odpRouter);
app.use(`${v1}`, authCMSRouter);
app.use(usersRouter);
// app.use(companiesRouter);
app.use(categoriesRouter);
app.use(imagesRouter);
// app.use(banksRouter);
// app.use(`${v1}`, userRefreshTokenRouter);

// use middleware
app.use(notFoundMiddleware);
app.use(handleErrorMiddleware);

module.exports = app;