const express = require('express');
const router = express();

const { create, index, indexInfinite, find, update, destroy, changeStatus } = require('./controller');

const {
	authenticateUser,
	authorizeRoles,
} = require('../../../middlewares/auth');

router.get('/companies', index);
router.get('/companies/infinite', indexInfinite);
router.post('/companies', create);
router.get('/companies/:id', find);
router.put('/companies/:id', update);
router.delete('/companies/:id', destroy);
router.put('/companies/:id/status', changeStatus);

module.exports = router;