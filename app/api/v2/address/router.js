const express = require('express');
const router = express();

const {create, index, find, update, destroy} = require('./controller');

const {
	authenticateUser,
	authorizeRoles,
} = require('../../../middlewares/auth');

// router.get('/address', authenticateUser, authorizeRoles('Company'), index);
// router.post('/address', authenticateUser, authorizeRoles('Company'), create);
// router.get('/address/:id', authenticateUser, authorizeRoles('Company'), find);
// router.put('/address/:id', authenticateUser, authorizeRoles('Company'), update);
// router.delete('/address/:id', authenticateUser, authorizeRoles('Company'), destroy);

router.get('/address', authenticateUser, index);
router.post('/address', authenticateUser, create);
router.get('/address/:id', authenticateUser, find);
router.put('/address/:id', authenticateUser, update);
router.delete('/address/:id', authenticateUser, destroy);

// router.get('/address', index);
// router.post('/address', create);
// router.get('/address/:id', find);
// router.put('/address/:id', update);
// router.delete('/address/:id', destroy);

module.exports = router;