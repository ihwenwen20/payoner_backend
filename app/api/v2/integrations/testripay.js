const express = require('express');
const crypto = require('crypto');
const fetch = require('node-fetch');

const app = express();
const port = 3000;

const apiKey = "DEV-V36VvrUw6DRkDNbsOuWfqsXwtTibCblZzcc588qI";
const privateKey = "5z9sS-EFZPC-Bzb5G-Gg6NW-uZG7I";

app.use(express.json());

app.post('/create-transaction', (req, res) => {
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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});