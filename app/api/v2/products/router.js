const express = require('express');
const router = express();
const {
	create,
	index, indexInfinite,
	find,
	update,
	destroy,
	uploadImage,
} = require('./controller');

const {
	authenticateCompany,
	authorizeRolesCompany,
} = require('../../../middlewares/auth');

const upload = require('../../../middlewares/multer');


const { getSingleProductReviews } = require('../reviews/controller');

// router.get('/products', authenticateCompany, authorizeRolesCompany('Developer', 'Owner', 'Company', 'Admin'), index);
router.post('/products', authenticateCompany, authorizeRolesCompany('Developer', 'Owner', 'Company', 'Admin'), create);
// router.get('/products/:id', authenticateCompany, authorizeRolesCompany('Developer', 'Owner', 'Company', 'Admin'), find);
router.put('/products/:id', authenticateCompany, authorizeRolesCompany('Developer', 'Owner', 'Company', 'Admin'), update);
router.delete('/products/:id', authenticateCompany, authorizeRolesCompany('Developer', 'Owner', 'Company', 'Admin'), destroy);


router.post('/uploadImage', authenticateCompany, upload.single('image'), uploadImage);
router.get('/products/:id/reviews', authenticateCompany, authorizeRolesCompany('Developer', 'Owner', 'Company', 'Admin'), getSingleProductReviews);

router.get('/products/:company', index);
router.get('/products/infinite', indexInfinite);

module.exports = router;