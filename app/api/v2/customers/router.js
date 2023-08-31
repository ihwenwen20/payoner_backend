const express = require('express');
const router = express();
const { create, index, find, update, destroy, changeStatus } = require('./controller');

const {
	authenticateCompany,
	authorizeRolesCompany,
	authenticateCustomer,
} = require('../../../middlewares/auth');

router.get('/customers', authenticateCompany, authorizeRolesCompany('Developer', 'Owner', 'Company', 'Admin'), index);
// router.post('/customers', authenticateCompany, authorizeRolesCompany('Developer', 'Owner', 'Company', 'Admin'), create);
// router.get('/customers/:id', authenticateCompany, authorizeRolesCompany('Developer', 'Owner', 'Company', 'Admin'), find);
// router.put('/customers/:id', authenticateCompany, authorizeRolesCompany('Developer', 'Owner', 'Company', 'Admin'), update);
router.delete('/customers/:id', authenticateCompany, authorizeRolesCompany('Developer', 'Owner', 'Company', 'Admin'), destroy);
router.put('/customers/:id/status', authenticateCompany, authorizeRolesCompany('Developer', 'Owner', 'Company', 'Admin'), changeStatus);

// router.get('/customers', index);
router.post('/customers', create);
router.get('/customers/:id', find);
router.put('/customers/:id', update);
// router.delete('/customers/:id', destroy);

module.exports = router;