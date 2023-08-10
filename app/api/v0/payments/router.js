const express = require('express');
const router = express();
const { create, index, find, update, destroy, changeStatus } = require('./controller');
const {
	authenticateUser,
	authorizeRoles,
} = require('../../../middlewares/auth');

router.get('/categories', authenticateUser, authorizeRoles('company'), index);
router.post('/categories', authenticateUser, authorizeRoles('company'), create);
router.get('/categories/:id', authenticateUser, authorizeRoles('company'), find);
router.put('/categories/:id', authenticateUser, authorizeRoles('company'), update);
router.delete('/categories/:id', authenticateUser, authorizeRoles('company'), destroy);
router.put('/companies/:id/status', authenticateUser, authorizeRoles('company'), changeStatus);

module.exports = router;
