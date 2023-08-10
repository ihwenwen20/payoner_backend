const express = require('express');
const router = express();
const { create, index, find, update, destroy } = require('./controller');

const {
	authenticateUser,
} = require('../../../middlewares/auth');

// router.get('/bank', authenticateUser, index);
// router.post('/bank', authenticateUser, create);
// router.get('/bank/:id', authenticateUser, find);
// router.put('/bank/:id', authenticateUser, update);
// router.delete('/bank/:id', authenticateUser, destroy);
router.get('/bank', index);
router.post('/bank', create);
router.get('/bank/:id', find);
router.put('/bank/:id', update);
router.delete('/bank/:id', destroy);

module.exports = router;