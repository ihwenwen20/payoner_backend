const express = require('express');
const router = express();
const {
  create,
  index,
  find,
  update,
  destroy,
  uploadImage,
} = require('./controller');
// const {
//   authenticateUser,
//   authorizePermissions,
// } = require('../middleware/authentication');

const upload = require('../../../middlewares/multer');


const { getSingleProductReviews } = require('../reviews/controller');

router.get('/products', index);
// router.get('/products/infinite', indexInfinite);
router.post('/products', create);
router.get('/products/:id', find);
router.put('/products/:id', update);
router.delete('/products/:id', destroy);

router.post('/uploadImage', upload.single('image'), uploadImage);
router.get('/products/:id/reviews',getSingleProductReviews);

module.exports = router;