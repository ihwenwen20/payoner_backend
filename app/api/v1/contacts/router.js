const express = require('express');
const router = express();

const {create, index, find, update, destroy} = require('./controller');

router.get('/contact', index);
router.post('/contact', create);
router.get('/contact/:id', find);
router.put('/contact/:id', update);
router.delete('/contact/:id', destroy);

module.exports = router;