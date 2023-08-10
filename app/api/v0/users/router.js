const express = require('express');
const router = express();
const { create, index, find, update, destroy,
	createCMSCompany,
	getCMSCompanies,
	changeStatus } = require('./controller');

const {
	authenticateUser,
	authorizeRoles,
} = require('../../../middlewares/auth');

// router.get('/companies', authenticateUser, authorizeRoles('owner'), getCMSCompanies);
// router.post('/companies', authenticateUser, authorizeRoles('owner'), createCMSCompany);
// router.put('/companies/:id/status', authenticateUser, authorizeRoles('owner'), changeStatus);
// router.get('/companies/:id', authenticateUser, authorizeRoles('owner'), find);
// router.put('/services/:id', authenticateUser, authorizeRoles('owner'), update);
// router.delete('/services/:id', authenticateUser, authorizeRoles('owner'), destroy);
// router.post('/services', authenticateUser, authorizeRoles('owner'), create);


router.get('/companies', getCMSCompanies);
router.post('/companies', createCMSCompany);
router.put('/companies/:id/status', changeStatus);
router.get('/companies/:id', find);


module.exports = router;