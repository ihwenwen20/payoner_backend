const express = require('express');
const router = express();

const { create, index, find, update, destroy } = require('./controller');

const {
	authenticateUser,
	authorizeRoles,
} = require('../../../middlewares/auth');

// router.get('/contact', authenticateUser, authorizeRoles('Company'), index);
// router.post('/contact', authenticateUser, authorizeRoles('Company'), create);
// router.get('/contact/:id', authenticateUser, authorizeRoles('Company'), find);
// router.put('/contact/:id', authenticateUser, authorizeRoles('Company'), update);
// router.delete('/contact/:id', authenticateUser, authorizeRoles('Company'), destroy);

router.get('/contact', authenticateUser, index);
router.post('/contact', authenticateUser, create);
router.get('/contact/:id', authenticateUser, find);
router.put('/contact/:id', authenticateUser, update);
router.delete('/contact/:id', authenticateUser, destroy);

// router.get('/contact', index);
// router.post('/contact', create);
// router.get('/contact/:id', find);
// router.put('/contact/:id', update);
// router.delete('/contact/:id', destroy);

module.exports = router;