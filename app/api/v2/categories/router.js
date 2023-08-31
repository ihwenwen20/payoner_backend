const express = require('express');
const router = express();

const { create, index, find, update, destroy } = require('./controller');

const {
	authenticateUser,
	authenticateCompany,
	authorizeRoles,
	authorizeRolesCompany,
} = require('../../../middlewares/auth');

router.get('/categories', authenticateCompany, authorizeRolesCompany('Developer', 'Owner', 'Company', 'Admin'), index);
router.post('/categories', authenticateCompany, authorizeRolesCompany('Developer', 'Owner', 'Company', 'Admin'), create);
router.get('/categories/:id', authenticateCompany, authorizeRolesCompany('Developer', 'Owner', 'Company', 'Admin'), find);
router.put('/categories/:id', authenticateCompany, authorizeRolesCompany('Developer', 'Owner', 'Company', 'Admin'), update);
router.delete('/categories/:id', authenticateCompany, authorizeRolesCompany('Developer', 'Owner', 'Company', 'Admin'), destroy);

// router.get('/categories', index);
// router.get('/categories/infinite', indexInfinite);
// router.post('/categories', create);
// router.get('/categories/:id', find);
// router.put('/categories/:id', update);
// router.delete('/categories/:id', destroy);

module.exports = router;