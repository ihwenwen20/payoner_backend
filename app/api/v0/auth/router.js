const express = require('express');
const router = express();
const { signinCms, signupCms, activeUser } = require('./controller');

router.post('/signin', signinCms);
router.post('/signup', signupCms);
// router.get('/logout', logout);
router.put('/activated', activeUser);

module.exports = router;
