const express = require('express');
const router = express();
const { create, index, indexInfinite, find, update, destroy, changeStatus } = require('./controller');

const {
	authenticateUser,
	authorizeRoles,
} = require('../../../middlewares/auth');

// router.get('/users', authenticateUser, authorizeRoles('developer'), index);
// router.post('/users', authenticateUser, authorizeRoles('developer'), create);
// router.get('/users/:id', authenticateUser, authorizeRoles('developer'), find);
// router.put('/users/:id', authenticateUser, authorizeRoles('developer'), update);
// router.delete('/users/:id', authenticateUser, authorizeRoles('developer'), destroy);
// router.put('/users/:id/status', authenticateUser, authorizeRoles('developer'), changeStatus);

router.get('/users', index);
router.get('/users/infinite', indexInfinite);
router.post('/users', create);
router.get('/users/:id', find);
router.put('/users/:id', update);
router.delete('/users/:id', destroy);
router.put('/users/:id/status', changeStatus);


module.exports = router;