const express = require('express');
const router = express();
const { create, index, find, update, destroy, changeStatus } = require('./controller');

const {
	authenticateCompany,
	authorizeRolesCompany,
} = require('../../../middlewares/auth');


const crypto = require('crypto');
const fetch = require('node-fetch');

router.get('/payments', authenticateCompany, authorizeRolesCompany('Developer', 'Owner', 'Company', 'Admin'), index);
router.post('/payments', authenticateCompany, authorizeRolesCompany('Developer', 'Owner', 'Company', 'Admin'), create);
router.get('/payments/:id', authenticateCompany, authorizeRolesCompany('Developer', 'Owner', 'Company', 'Admin'), find);
router.put('/payments/:id', authenticateCompany, authorizeRolesCompany('Developer', 'Owner', 'Company', 'Admin'), update);
router.delete('/payments/:id', authenticateCompany, authorizeRolesCompany('Developer', 'Owner', 'Company', 'Admin'), destroy);
router.put('/payments/:id/status', authenticateCompany, authorizeRolesCompany('Developer', 'Owner', 'Company', 'Admin'), changeStatus);

// router.get('/payment', index);
// router.post('/payment', create);
// router.get('/payment/:id', find);
// router.put('/payment/:id', update);
// router.delete('/payment/:id', destroy);
// router.put('/payment/:id/status', changeStatus);

const apiKey = "DEV-V36VvrUw6DRkDNbsOuWfqsXwtTibCblZzcc588qI";
const privateKey = "5z9sS-EFZPC-Bzb5G-Gg6NW-uZG7I";

router.post('/tripay', (req, res) => {
  const merchant_code = "T25139";
  const merchant_ref = Date.now();
  const amount = 1000000;
  const expiry = parseInt(Math.floor(new Date() / 1000) + 24 * 60 * 60);

  const signature = crypto
    .createHmac('sha256', privateKey)
    .update(merchant_code + merchant_ref + amount)
    .digest('hex');

  const payload = {
    method: 'BRIVA',
    merchant_ref: merchant_ref,
    amount: amount,
    customer_name: 'Nama Pelanggan',
    customer_email: 'emailpelanggan@domain.com',
    customer_phone: '081234567890',
    order_items: [
      {
        sku: 'PRODUK1',
        name: 'Nama Produk 1',
        price: 500000,
        quantity: 1,
        product_url: 'https://tokokamu.com/product/nama-produk-1',
        image_url: 'https://tokokamu.com/product/nama-produk-1.jpg',
      },
      {
        sku: 'PRODUK2',
        name: 'Nama Produk 2',
        price: 500000,
        quantity: 1,
        product_url: 'https://tokokamu.com/product/nama-produk-2',
        image_url: 'https://tokokamu.com/product/nama-produk-2.jpg',
      },
    ],
    return_url: 'https://wa.me/6285211891252',
    expired_time: expiry,
    signature: signature,
  };

  fetch('https://tripay.co.id/api-sandbox/transaction/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + apiKey,
    },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      res.send(data);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Internal Server Error');
    });
});

router.post('/tripay-callback', function (request, response) {
	var json = request.body;
	var signature = crypto.createHmac("sha256", privateKey)
			.update(json)
			.digest('hex');

	console.log(signature);
	console.log(json);
});

module.exports = router;