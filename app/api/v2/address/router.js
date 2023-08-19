const express = require('express');
const router = express();

const {create, index, indexInfinite,find, update, destroy} = require('./controller');

const {
	authenticateUser,
	authorizeRoles,
} = require('../../../middlewares/auth');

// router.get('/address', authenticateUser, authorizeRoles('company'), index);
// router.post('/address', authenticateUser, authorizeRoles('company'), create);
// router.get('/address/:id', authenticateUser, authorizeRoles('company'), find);
// router.put('/address/:id', authenticateUser, authorizeRoles('company'), update);
// router.delete('/address/:id', authenticateUser, authorizeRoles('company'), destroy);

router.get('/address', index);
router.get('/address/infinite', indexInfinite);
router.post('/address', create);
router.get('/address/:id', find);
router.put('/address/:id', update);
router.delete('/address/:id', destroy);

module.exports = router;