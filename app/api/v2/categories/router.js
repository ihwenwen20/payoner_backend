const express = require('express');
const router = express();

const {create, index, indexInfinite,find, update, destroy} = require('./controller');

const {
	authenticateUser,
	authorizeRoles,
} = require('../../../middlewares/auth');

// router.get('/categories', authenticateUser, authorizeRoles('company'), index);
// router.post('/categories', authenticateUser, authorizeRoles('company'), create);
// router.get('/categories/:id', authenticateUser, authorizeRoles('company'), find);
// router.put('/categories/:id', authenticateUser, authorizeRoles('company'), update);
// router.delete('/categories/:id', authenticateUser, authorizeRoles('company'), destroy);

router.get('/categories', index);
router.get('/categories/infinite', indexInfinite);
router.post('/categories', create);
router.get('/categories/:id', find);
router.put('/categories/:id', update);
router.delete('/categories/:id', destroy);

module.exports = router;