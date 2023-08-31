const express = require('express');
const router = express();
const {
  index,
	indexInfinite,
	create,
	find,
	update,
	destroy,
	getCurrentUserOrders,
} = require('./controller');

router.get('/orders', index);
router.get('/orders/infinite', indexInfinite);
router.post('/orders', create);
router.get('/orders/:id', find);
router.put('/orders/:id', update);
router.delete('/orders/:id', destroy);
router.get('/showAllMyOrders', getCurrentUserOrders);


module.exports = router;