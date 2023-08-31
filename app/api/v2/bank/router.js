const express = require('express');
const router = express();

const { create, index,  find, update, destroy } = require('./controller');

const {
	authenticateCompany,
	authorizeRolesCompany,
} = require('../../../middlewares/auth');

router.get('/bank', authenticateCompany, authorizeRolesCompany('Developer', 'Owner', 'Company', 'Admin'), index);
router.post('/bank', authenticateCompany, authorizeRolesCompany('Developer', 'Owner', 'Company', 'Admin'), create);
router.get('/bank/:id', authenticateCompany, authorizeRolesCompany('Developer', 'Owner', 'Company', 'Admin'), find);
router.put('/bank/:id', authenticateCompany, authorizeRolesCompany('Developer', 'Owner', 'Company', 'Admin'), update);
router.delete('/bank/:id', authenticateCompany, authorizeRolesCompany('Developer', 'Owner', 'Company', 'Admin'), destroy);

// router.get('/bank', index);
// router.post('/bank', create);
// router.get('/bank/:id', find);
// router.put('/bank/:id', update);
// router.delete('/bank/:id', destroy);

module.exports = router;