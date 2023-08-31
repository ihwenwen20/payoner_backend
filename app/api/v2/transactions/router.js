const express = require('express');
const router = express();
const {create, index, find, update, destroy, changeStatus} = require('./controller');

const {
	authenticateUser,
	authorizeRoles,
} = require('../../../middlewares/auth');

// router.get('/transactions', authenticateUser, authorizeRoles('company'), index);
// router.get('/transactions/:id', authenticateUser, authorizeRoles('company'), find);
// router.put('/transactions/:id', authenticateUser, authorizeRoles('company'), update);
// router.delete('/transactions/:id', authenticateUser, authorizeRoles('company'), destroy);
// router.post('/transactions', authenticateUser, authorizeRoles('company'), create);
// router.put('/transactions/:id/status', authenticateUser, authorizeRoles('company'), changeStatus);

router.get('/transactions', index);
router.get('/transactions/:id', find);
router.put('/transactions/:id', update);
router.delete('/transactions/:id', destroy);
router.post('/transactions', create);
router.put('/transactions/:id/status', changeStatus);

module.exports = router;