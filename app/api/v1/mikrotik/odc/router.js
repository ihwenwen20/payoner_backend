const express = require('express');
const router = express();
const { create, index, find, update, destroy } = require('./controller');

// const {
// 	authenticateUser,
// } = require('../../../../middlewares/auth');

// router.get('/odc', authenticateUser, index);
// router.post('/odc', authenticateUser, create);
// router.get('/odc/:id', authenticateUser, find);
// router.put('/odc/:id', authenticateUser, update);
// router.delete('/odc/:id', authenticateUser, destroy);
router.get('/odc', index);
router.post('/odc', create);
router.get('/odc/:id', find);
router.put('/odc/:id', update);
router.delete('/odc/:id', destroy);

module.exports = router;