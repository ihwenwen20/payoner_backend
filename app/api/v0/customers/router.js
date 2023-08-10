const express = require('express');
const router = express();
const {
	signup,
	activeCustomer,
	signin,
	landingPage,
	detailPage,
	getDashboard,
	checkout,
	getAllPayment,
} = require('./controller');

const {authenticateCustomer} = require('../../../middlewares/auth');

router.post('/auth/signup', signup);
router.post('/auth/signin', signin);
router.put('/active', activeCustomer);
router.get('/services', landingPage);
router.get('/services/:id', detailPage);
router.get('/payments/:company', authenticateCustomer, getAllPayment);
router.get('/orders', authenticateCustomer, getDashboard);
router.post('/checkout', authenticateCustomer, checkout);

module.exports = router;
