const express = require('express');
const router = express();
const { create, index, find, update, destroy, changeStatus, showCurrentUser } = require('./controller');

const {
	authenticateUser,
	authorizeRoles,
} = require('../../../middlewares/auth');

router.get('/users', authenticateUser, authorizeRoles('Developer'), index);
router.post('/users', authenticateUser, authorizeRoles('Developer'), create);
router.get('/users/:id', authenticateUser, authorizeRoles('Developer', 'Owner'), find);
router.put('/users/:id', authenticateUser, authorizeRoles('Developer'), update);
router.delete('/users/:id', authenticateUser, authorizeRoles('Developer'), destroy);
router.put('/users/:id/status', authenticateUser, authorizeRoles('Developer'), changeStatus);
router.get('/showMe', authenticateUser, showCurrentUser);

// router.get('/users', authenticateUser, index);
// router.post('/users', authenticateUser, create);
// router.get('/users/:id', authenticateUser, find);
// router.put('/users/:id', authenticateUser, update);
// router.delete('/users/:id', authenticateUser, destroy);
// router.put('/users/:id/status', authenticateUser, changeStatus);

// router.get('/users', index);
// router.post('/users', create);
// router.get('/users/:id', find);
// router.put('/users/:id', update);
// router.delete('/users/:id', destroy);
// router.put('/users/:id/status', changeStatus);


module.exports = router;