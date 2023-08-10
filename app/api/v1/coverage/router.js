const express = require('express');
const router = express();
const { create, index, find, update, destroy } = require('./controller');

const {
	authenticateUser,
} = require('../../../middlewares/auth');

// router.get('/coverage', authenticateUser, index);
// router.post('/coverage', authenticateUser, create);
// router.get('/coverage/:id', authenticateUser, find);
// router.put('/coverage/:id', authenticateUser, update);
// router.delete('/coverage/:id', authenticateUser, destroy);
router.get('/coverage', index);
router.post('/coverage', create);
router.get('/coverage/:id', find);
router.put('/coverage/:id', update);
router.delete('/coverage/:id', destroy);

module.exports = router;