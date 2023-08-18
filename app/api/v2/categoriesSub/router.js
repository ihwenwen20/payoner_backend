const express = require('express');
const router = express();

const {create, index, indexInfinite,find, update, destroy} = require('./controller');

const {
	authenticateUser,
	authorizeRoles,
} = require('../../../middlewares/auth');

// router.get('/categories', authenticateUser, authorizeRoles('company'), index);
// router.post('/categories', authenticateUser, authorizeRoles('company'), create);
// router.get('/categories/:id', authenticateUser, authorizeRoles('company'), find);
// router.put('/categories/:id', authenticateUser, authorizeRoles('company'), update);
// router.delete('/categories/:id', authenticateUser, authorizeRoles('company'), destroy);

router.get('/subcategories', index);
router.get('/subcategories/infinite', indexInfinite);
router.post('/subcategories', create);
router.get('/subcategories/:id', find);
router.put('/subcategories/:id', update);
router.delete('/subcategories/:id', destroy);

module.exports = router;