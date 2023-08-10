const express = require('express');
const router = express();
const {
	createCMSUser,
} = require('./controller');

const {
	authenticateUser,
	authorizeRoles,
} = require('../../../middlewares/auth');

router.post('/users', authenticateUser, authorizeRoles('company'), createCMSUser);
module.exports = router;
