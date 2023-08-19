const express = require('express');
const router = express();
const { create, index, indexInfinite, find, update, destroy, changeStatus } = require('./controller');

const {
	authenticateUser,
	authorizeRoles,
} = require('../../../middlewares/auth');

// router.get('/payment', authenticateUser, authorizeRoles('developer'), index);
// router.post('/payment', authenticateUser, authorizeRoles('developer'), create);
// router.get('/payment/:id', authenticateUser, authorizeRoles('developer'), find);
// router.put('/payment/:id', authenticateUser, authorizeRoles('developer'), update);
// router.delete('/payment/:id', authenticateUser, authorizeRoles('developer'), destroy);
// router.put('/payment/:id/status', authenticateUser, authorizeRoles('developer'), changeStatus);

router.get('/payment', index);
router.get('/payment/infinite', indexInfinite);
router.post('/payment', create);
router.get('/payment/:id', find);
router.put('/payment/:id', update);
router.delete('/payment/:id', destroy);
router.put('/payment/:id/status', changeStatus);


module.exports = router;