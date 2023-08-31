const express = require('express');
const router = express();

const { create, index, find, update, destroy, changeStatus } = require('./controller');

const {
	authenticateUser,
	authorizeRoles,
} = require('../../../middlewares/auth');

router.get('/companies', authenticateUser, authorizeRoles('Developer', 'Owner'), index);
router.post('/companies', authenticateUser, authorizeRoles('Developer', 'Owner'), create);
router.get('/companies/:id', authenticateUser, authorizeRoles('Developer', 'Owner'), find);
router.put('/companies/:id', authenticateUser, authorizeRoles('Developer', 'Owner'), update);
router.delete('/companies/:id', authenticateUser, authorizeRoles('Developer', 'Owner'), destroy);
router.put('/companies/:id/status', authenticateUser, authorizeRoles('Developer', 'Owner'), changeStatus);

// router.get('/companies', authenticateUser, index);
// router.post('/companies', authenticateUser, create);
// router.get('/companies/:id', authenticateUser, find);
// router.put('/companies/:id', authenticateUser, update);
// router.delete('/companies/:id', authenticateUser, destroy);
// router.put('/companies/:id/status', authenticateUser, changeStatus);

// router.get('/companies', index);
// router.post('/companies', create);
// router.get('/companies/:id', find);
// router.put('/companies/:id', update);
// router.delete('/companies/:id', destroy);
// router.put('/companies/:id/status', changeStatus);

module.exports = router;