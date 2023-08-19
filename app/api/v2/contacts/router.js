const express = require('express');
const router = express();

const {create, index, indexInfinite,find, update, destroy} = require('./controller');

const {
	authenticateUser,
	authorizeRoles,
} = require('../../../middlewares/auth');

router.get('/contact', index);
router.get('/contact/infinite', indexInfinite);
router.post('/contact', create);
router.get('/contact/:id', find);
router.put('/contact/:id', update);
router.delete('/contact/:id', destroy);

module.exports = router;