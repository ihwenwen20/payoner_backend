const express = require('express');
const router = express();
const { create, index, find, update, destroy } = require('./controller');

// const {
// 	authenticateUser,
// 	authorizeRoles,
// } = require('../../../middlewares/auth');

// router.get('/roles', authenticateUser, authorizeRoles('company'), index);
// router.get('/roles/:id', authenticateUser, authorizeRoles('company'), find);
// router.put('/roles/:id', authenticateUser, authorizeRoles('company'), update);
// router.delete('/roles/:id', authenticateUser, authorizeRoles('company'), destroy);
// router.post('/roles', authenticateUser, authorizeRoles('company'), create);
router.get('/roles', index);
router.get('/roles/:id', find);
router.put('/roles/:id', update);
router.delete('/roles/:id', destroy);
router.post('/roles', create);

router.get('/Permissions', index);
router.get('/Permissions/:id', find);
router.put('/Permissions/:id', update);
router.delete('/Permissions/:id', destroy);
router.post('/Permissions', create);

module.exports = router;