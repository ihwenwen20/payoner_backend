const express = require('express');
const router = express();
const { create, index, find, update, destroy, changeStatus } = require('./controller');

const {
	authenticateCompany,
	authorizeRolesCompany,
} = require('../../../middlewares/auth');

router.get('/coverage', authenticateCompany, authorizeRolesCompany('Developer', 'Owner', 'Company', 'Admin'), index);
router.post('/coverage', authenticateCompany, authorizeRolesCompany('Developer', 'Owner', 'Company', 'Admin'), create);
router.get('/coverage/:id', authenticateCompany, authorizeRolesCompany('Developer', 'Owner', 'Company', 'Admin'), find);
router.put('/coverage/:id', authenticateCompany, authorizeRolesCompany('Developer', 'Owner', 'Company', 'Admin'), update);
router.delete('/coverage/:id', authenticateCompany, authorizeRolesCompany('Developer', 'Owner', 'Company', 'Admin'), destroy);
router.put('/coverage/:id/status', authenticateCompany, authorizeRolesCompany('Developer', 'Owner', 'Company', 'Admin'), changeStatus);

// router.get('/coverage', index);
// router.post('/coverage', create);
// router.get('/coverage/:id', find);
// router.put('/coverage/:id', update);
// router.delete('/coverage/:id', destroy);

module.exports = router;