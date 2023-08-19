const express = require('express');
const router = express();

const { create, index, indexInfinite, find, update, destroy } = require('./controller');

const {
	authenticateUser,
	authorizeRoles,
} = require('../../../middlewares/auth');

// router.get('/bank', authenticateUser, authorizeRoles('company'), index);
// router.post('/bank', authenticateUser, authorizeRoles('company'), create);
// router.get('/bank/:id', authenticateUser, authorizeRoles('company'), find);
// router.put('/bank/:id', authenticateUser, authorizeRoles('company'), update);
// router.delete('/bank/:id', authenticateUser, authorizeRoles('company'), destroy);

router.get('/bank', index);
router.get('/bank/infinite', indexInfinite);
router.post('/bank', create);
router.get('/bank/:id', find);
router.put('/bank/:id', update);
router.delete('/bank/:id', destroy);

module.exports = router;