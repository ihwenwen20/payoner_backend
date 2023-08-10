const express = require('express');
const router = express();
const {
	// createCMSUser,
	update,
} = require('./controller');

const {
	authenticateUser,
	authorizeRoles,
} = require('../../../middlewares/auth');

// router.post('/users', authenticateUser, authorizeRoles('company'), createCMSUser);
router.put('/companies/:id', authenticateUser, authorizeRoles('owner','company'), update);
// router.put('/companies/:id/status', authenticateUser, authorizeRoles('owner'), changeStatus);

module.exports = router;
