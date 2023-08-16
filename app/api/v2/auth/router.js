const express = require('express');
const router = express();
const {
	register,
	login,
	showMe,
	activeUser,
	logout } = require('./controller');

router.post('/signup', register);
router.post('/signin', login);
router.get('/me/:refreshToken/:email', showMe);
router.post('/logout', logout);
router.put('/activated', activeUser);

module.exports = router;
