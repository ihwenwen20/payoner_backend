const https = require('https');
const config = require('../config/tripay');

async function initiateTriPayPayment(orderId, amount, customerDetails, tripayConfig) {
  const mergedConfig = { ...config, ...tripayConfig };

  const postData = JSON.stringify({
    order_id: orderId,
    amount,
    customer: customerDetails,
  });

  const options = {
    hostname: mergedConfig.baseUrl,
    path: '/v2/create_invoice',
    method: 'POST',
    headers: {
      Authorization: `Bearer ${mergedConfig.apiKey}`,
      'Content-Type': 'application/json',
      'Content-Length': postData.length,
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        const response = JSON.parse(data);
        resolve(response.invoice_url);
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

module.exports = {
  initiateTriPayPayment,
};