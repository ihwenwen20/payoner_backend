const express = require('express');
const router = express();
const {index} = require('./controller');

router.get(
	// '/refresh-token/:refreshToken/:email',
	'/refresh-token/',
	index
);

module.exports = router;
