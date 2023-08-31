const express = require('express');
const router = express();
const {
	register,
	login,
	showMe,
	activeUser,
	logout,
	forgotPassword,
	resetP,
	changeP,
	loginCompany,
 } = require('./controller');

router.post('/signup', register);
router.post('/signin', login);
router.get('/me/:refreshToken/:email', showMe);
router.post('/logout', logout);
router.put('/activated', activeUser);
router.post('/forgotPassword', forgotPassword);
router.post('/resetPassword/:refreshToken/:email', resetP);
// router.post('/changePassword/:refreshToken/:email', changeP);
router.post('/login', loginCompany);

module.exports = router;
