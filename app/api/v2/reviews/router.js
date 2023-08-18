const express = require('express');
const router = express();
const {
  create,
  index,
  find,
  update,
  destroy,
} = require('./controller');

router.get('/reviews', index);
// router.get('/reviews/infinite', indexInfinite);
router.post('/reviews', create);
router.get('/reviews/:id', find);
router.put('/reviews/:id', update);
router.delete('/reviews/:id', destroy);

module.exports = router;