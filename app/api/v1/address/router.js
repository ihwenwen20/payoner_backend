const express = require('express');
const router = express();

const {create, index, find, update, destroy} = require('./controller');

router.get('/address', index);
router.post('/address', create);
router.get('/address/:id', find);
router.put('/address/:id', update);
router.delete('/address/:id', destroy);

module.exports = router;