const express = require('express');
const router = express();
const { create, index, find, update, destroy } = require('./controller');

const {
	authenticateUser,
} = require('../../../middlewares/auth');

router.get('/bank', authenticateUser, index);
router.get('/bank/:id', authenticateUser, find);
router.put('/bank/:id', authenticateUser, update);
router.post('/bank', authenticateUser, create);
router.delete('/bank/:id', authenticateUser, destroy);

module.exports = router;