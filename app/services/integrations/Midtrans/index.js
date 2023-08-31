const express = require('express');
const router = express();
const Order = require('../models/order');
const midtransClient = require('midtrans-client');

// Create Core API instance
let coreApi = new midtransClient.CoreApi({
	isProduction : false,
	serverKey : 'YOUR_SERVER_KEY',
	clientKey : 'YOUR_CLIENT_KEY'
});

let snap = new midtransClient.Snap({
	isProduction : false,
	serverKey : 'YOUR_SERVER_KEY',
	clientKey : 'YOUR_CLIENT_KEY'
});

router.get('/trx', function (req, res, next) {
	Order.findAll().then(data => {
		const tampilData = data.map(item => {
			return {
				id: item.id,
				tiket_id: item.tiket_id,
				nama: item.nama,
				response_midtrans: JSON.parse(item.response_midtrans),
				createdAt: item.createdAt,
				updatedAt: item.updatedAt
			}
		});
		res.json({
			status: true,
			pesan: "Berhasil Tampil",
			data: tampilData
		});
	}).catch(err => {
		res.json({
			status: false,
			pesan: "Gagal tampil: " + err.message,
			data: []
		});
	});
});

router.post('/charge', function (req, res, next) {
	coreApi.charge(req.body).then((chargeResponse) => {
		const dataOrder = {
			id: chargeResponse.order_id,
			tiket_id: req.body.tiket_id,
			nama: req.body.nama,
			response_midtrans: JSON.stringify(chargeResponse)
		}
		Order.create(dataOrder).then(data => {
			res.json({
				status: true,
				pesan: "Berhasil Order",
				data: data
			});
		}).catch(err => {
			res.json({
				status: false,
				pesan: "Gagal Order: " + err.message,
				data: []
			});
		});
	}).catch((e) => {
		res.json({
			status: false,
			pesan: "Gagal order: " + e.message,
			data: []
		});
	});
});

router.post('/notifikasi', function (req, res, next) {
	coreApi.transaction.notification(req.body)
		.then((statusResponse) => {
			let orderId = statusResponse.order_id;
			let responseMidtrans = JSON.stringify(statusResponse);
			Order.update({ response_midtrans: responseMidtrans }, {
				where: { id: orderId }
			}).then(() => {
				res.json({
					status: true,
					pesan: "Berhasil Notifikasi",
					data: []
				});
			}).catch(err => {
				res.status(500).json({

					status: false,
					pesan: "Gagal Notifikasi: " + err.message,
					data: []
				});
			});
		});
});

router.get('/status/:order_id', function (req, res, next) {
	coreApi.transaction.status(req.params.order_id).then((statusResponse) => {
		let responseMidtrans = JSON.stringify(statusResponse);
		Order.update({ response_midtrans: responseMidtrans }, {
			where: { id: req.params.order_id }
		}).then(() => {
			res.json({
				status: true,
				pesan: "Berhasil cek status",
				data: statusResponse
			});
		}).catch(err => {
			res.json({
				status: false,
				pesan: "Gagal cek status: " + err.message,
				data: []
			});
		});
	});
});

module.exports = router;