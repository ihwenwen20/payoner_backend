const express = require('express');
const router = express();

const {create, index, find, update, destroy} = require('./controller');

const {
	authenticateUser,
	authorizeRoles,
} = require('../../../middlewares/auth');

// router.get('/categories', authenticateUser, authorizeRoles('company', 'owner'), index);
// router.post('/categories', authenticateUser, authorizeRoles('company', 'owner'), create);
// router.get('/categories/:id', authenticateUser, authorizeRoles('company', 'owner'), find);
// router.put('/categories/:id', authenticateUser, authorizeRoles('company', 'owner'), update);
// router.delete('/categories/:id', authenticateUser, authorizeRoles('company', 'owner'), destroy);

router.get('/categories', index);
router.post('/categories', create);
router.get('/categories/:id', find);
router.put('/categories/:id', update);
router.delete('/categories/:id', destroy);

module.exports = router;