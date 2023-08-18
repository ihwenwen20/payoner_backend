const express = require('express');
const router = express();

const { create, index, indexInfinite, find, update, destroy } = require('./controller');

const {
	authenticateUser,
	authorizeRoles,
} = require('../../../middlewares/auth');

// router.get('/categories', authenticateUser, authorizeRoles('company'), index);
// router.post('/categories', authenticateUser, authorizeRoles('company'), create);
// router.get('/categories/:id', authenticateUser, authorizeRoles('company'), find);
// router.put('/categories/:id', authenticateUser, authorizeRoles('company'), update);
// router.delete('/categories/:id', authenticateUser, authorizeRoles('company'), destroy);

router.get('/customers', index);
router.get('/customers/infinite', indexInfinite);
router.post('/customers', create);
router.get('/customers/:id', find);
router.put('/customers/:id', update);
router.delete('/customers/:id', destroy);

module.exports = router;