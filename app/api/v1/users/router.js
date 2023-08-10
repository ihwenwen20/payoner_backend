const express = require('express');
const router = express();
const { create, index, find, update, destroy, changeStatus } = require('./controller');

const {
	authenticateUser,
	authorizeRoles,
} = require('../../../middlewares/auth');

// router.get('/users', authenticateUser, authorizeRoles('owner'), index);
router.post('/users', authenticateUser, authorizeRoles('owner'), create);
router.get('/users/:id', authenticateUser, authorizeRoles('owner'), find);
router.put('/users/:id', authenticateUser, authorizeRoles('owner'), update);
router.delete('/users/:id', authenticateUser, authorizeRoles('owner'), destroy);
router.put('/users/:id/status', authenticateUser, authorizeRoles('owner'), changeStatus);

router.get('/users', index);
// router.get('/companies', index);
// router.post('/companies', create);
// router.get('/companies/:id', find);
// router.put('/companies/:id', update);
// router.delete('/companies/:id', destroy);
// router.put('/companies/:id/status', changeStatus);


module.exports = router;