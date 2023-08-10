const express = require('express');
const router = express();
const { create, index, find, update, destroy } = require('./controller');

const {
	authenticateUser,
} = require('../../../../middlewares/auth');

// router.get('/odp', authenticateUser, index);
// router.post('/odp', authenticateUser, create);
// router.get('/odp/:id', authenticateUser, find);
// router.put('/odp/:id', authenticateUser, update);
// router.delete('/odp/:id', authenticateUser, destroy);
router.get('/odp', index);
router.post('/odp', create);
router.get('/odp/:id', find);
router.put('/odp/:id', update);
router.delete('/odp/:id', destroy);

module.exports = router;