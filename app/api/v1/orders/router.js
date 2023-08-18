const express = require('express');
const router = express();
const {
  create,
  index,
  find,
	getCurrentUserOrders,
  update,
} = require('./controller');

router.get('/orders', index);
// router.get('/orders/infinite', indexInfinite);
router.post('/orders', create);
router.get('/orders/:id', find);
router.put('/orders/:id', update);
router.get('/showAllMyOrders', getCurrentUserOrders);


module.exports = router;