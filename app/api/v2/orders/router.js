const express = require('express');
const router = express();
const {
	index,
	indexInfinite,
	create,
	find,
	update,
	destroy,
	getCurrentUserOrders, balance,
	changeStatus,getOrdersById,getOrder
} = require('./controller');
// Paramaters

const {
	authenticateCompany,
	authorizeRolesCompany,
} = require('../../../middlewares/auth');

router.get('/orders', authenticateCompany, authorizeRolesCompany('Developer', 'Owner', 'Company', 'Admin'), index);
router.post('/orders/:id/pay', authenticateCompany, authorizeRolesCompany('Developer', 'Owner', 'Company', 'Admin'), find);
router.put('/orders/:id', authenticateCompany, authorizeRolesCompany('Developer', 'Owner', 'Company', 'Admin'), update);
router.delete('/orders/:id', authenticateCompany, authorizeRolesCompany('Developer', 'Owner', 'Company', 'Admin'), destroy);
router.put('/orders/:id/status', authenticateCompany, authorizeRolesCompany('Developer', 'Owner', 'Company', 'Admin'), changeStatus);


// router.param("orderId", getOrdersById);
// router.get("/orders/:orderId/customer", getOrder);

// router.get('/orders', index);
// router.get('/orders/infinite', indexInfinite);
router.post('/orders', create);
// router.post('/orders/:id/pay', find);
router.get('/orders/:id', find);
// router.put('/orders/:id', update);
// router.delete('/orders/:id', destroy);
// router.get('/showAllMyOrders', getCurrentUserOrders);

// router.get('/orders/:id/balance', balance);
// router.put('/orders/:id/status', changeStatus);


module.exports = router;