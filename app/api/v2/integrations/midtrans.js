const midtrans = require('midtrans-client');
const config = require('../config/midtrans');

const midtransClient = new midtrans.CoreApi({
	isProduction: false,
	serverKey: config.serverKey,
	clientKey: config.clientKey,
});

// Fungsi untuk inisiasi pembayaran Midtrans
async function initiateMidtransPayment(orderId, amount, customerDetails) {
	const snapToken = await midtransClient.createSnapToken({
		transaction_details: {
			order_id: orderId,
			gross_amount: amount,
		},
		customer_details: customerDetails,
	});

	return snapToken;
}

module.exports = {
	initiateMidtransPayment,
};