const express = require('express');
const router = express();
const { create, index, find, update, destroy } = require('./controller');

const {
	authenticateCompany,
	authorizeRolesCompany,
} = require('../../../middlewares/auth');

router.get('/subcategories', authenticateCompany, authorizeRolesCompany('Developer', 'Owner', 'Company', 'Admin'), index);
router.post('/subcategories', authenticateCompany, authorizeRolesCompany('Developer', 'Owner', 'Company', 'Admin'), create);
router.get('/subcategories/:id', authenticateCompany, authorizeRolesCompany('Developer', 'Owner', 'Company', 'Admin'), find);
router.put('/subcategories/:id', authenticateCompany, authorizeRolesCompany('Developer', 'Owner', 'Company', 'Admin'), update);
router.delete('/subcategories/:id', authenticateCompany, authorizeRolesCompany('Developer', 'Owner', 'Company', 'Admin'), destroy);

// router.get('/subcategories', index);
// router.post('/subcategories', create);
// router.get('/subcategories/:id', find);
// router.put('/subcategories/:id', update);
// router.delete('/subcategories/:id', destroy);

module.exports = router;