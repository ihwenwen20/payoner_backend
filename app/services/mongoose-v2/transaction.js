// const Transaction = require('../../api/v2/transactions/model');
// const {checkingImage} = require('./images');
// const {checkingCategories} = require('./categories');
// const {checkingVendors} = require('./vendors');
const StockTransaction = require('../../api/v2/transactions/transactionStock');
const Product = require('../../api/v2/products/model');

// import custom error not found dan bad request
const {NotFoundError, BadRequestError} = require('../../errors');

const createStockTransaction = async (productId, amount) => {
  try {
    const product = await Product.findOne({ _id: productId });
    if (!product) {
      throw new Error(`Product with ID ${productId} not found`);
    }

    if (amount > product.inventory) {
      throw new Error(`Insufficient inventory for product with ID ${productId}`);
    }

    // Membuat transaksi stok baru
    const stockTransaction = new StockTransaction({
      products: [{ product: productId, amount }],
      status: 'Pending',
    });

    // Menyimpan transaksi stok
    await stockTransaction.save();

    // Mengurangi stok produk
    product.inventory -= amount;
    await product.save();

    return stockTransaction;
  } catch (error) {
    throw error;
  }
};

const rollbackStockTransaction = async (transactionId) => {
  try {
    const stockTransaction = await StockTransaction.findOne({ _id: transactionId });
    if (!stockTransaction) {
      throw new Error(`Stock transaction with ID ${transactionId} not found`);
    }

    // Mengembalikan stok produk yang telah dikurangkan
    for (const stockProduct of stockTransaction.products) {
      const product = await Product.findOne({ _id: stockProduct.product });
      if (product) {
        product.inventory += stockProduct.amount;
        await product.save();
      }
    }

    // Menghapus transaksi stok
    await StockTransaction.findByIdAndDelete(transactionId);

    return true; // Berhasil melakukan rollback
  } catch (error) {
    throw error;
  }
};

// const getAllTransaction = async (req) => {
// 	const {keyword, category, vendor, status} = req.query;
// 	// let condition = {};
// 	let condition = {company: req.user.company};

// 	if (keyword) {
// 		condition = {...condition, title: {$regex: keyword, $options: 'i'}};
// 	}

// 	if (category) {
// 		condition = {...condition, category: category};
// 	}

// 	if (vendor) {
// 		condition = {...condition, vendor: vendor};
// 	}

// 	if ([ 'Draft', 'Published' ].includes(status)) {
// 		condition = {
// 			...condition,
// 			statusService: status,
// 		};
// 	}

// 	console.log('condition');
// 	console.log(condition);

// 	const result = await Transaction.find(condition)
// 		.populate({path: 'image', select: '_id name'})
// 		.populate({
// 			path: 'category',
// 			select: '_id name',
// 		})
// 		.populate({
// 			path: 'vendor',
// 			select: '_id name role image',
// 			populate: {path: 'image', select: '_id  name'},
// 		});

// 	return result;
// };

// const createTransaction = async (req) => {
// 	const {
// 		title,
// 		date,
// 		about,
// 		tagline,
// 		venueName,
// 		keyPoint,
// 		statusService,
// 		tickets,
// 		image,
// 		category,
// 		vendor,
// 	} = req.body;

// 	// cari image, category dan vendor dengan field id
// 	await checkingImage(image);
// 	await checkingCategories(category);
// 	await checkingVendors(vendor);

// 	// cari Transaction dengan field name
// 	const check = await Transaction.findOne({title});

// 	// apa bila check true / data Transaction sudah ada maka kita tampilkan error bad request dengan message judul acara sudah terdaftar
// 	if (check) throw new BadRequestError('judul acara sudah terdaftar');

// 	const result = await Transaction.create({
// 		title,
// 		date,
// 		about,
// 		tagline,
// 		venueName,
// 		keyPoint,
// 		statusService,
// 		tickets,
// 		image,
// 		category,
// 		vendor,
// 		company: req.user.company,
// 	});

// 	return result;
// };

// const getOneTransaction = async (req) => {
// 	const {id} = req.params;

// 	const result = await Transaction.findOne({
// 		_id: id,
// 		company: req.user.company,
// 	})
// 		.populate({path: 'image', select: '_id name'})
// 		.populate({
// 			path: 'category',
// 			select: '_id name',
// 		})
// 		.populate({
// 			path: 'vendor',
// 			select: '_id name role image',
// 			populate: {path: 'image', select: '_id  name'},
// 		});

// 	if (!result) throw new NotFoundError(`Tidak ada acara dengan id :  ${id}`);

// 	return result;
// };

// const updateTransaction = async (req) => {
// 	const {id} = req.params;
// 	const {
// 		title,
// 		date,
// 		about,
// 		tagline,
// 		venueName,
// 		keyPoint,
// 		statusService,
// 		tickets,
// 		image,
// 		category,
// 		vendor,
// 	} = req.body;

// 	// cari image, category dan vendor dengan field id
// 	await checkingImage(image);
// 	await checkingCategories(category);
// 	await checkingVendors(vendor);

// 	// cari Service berdasarkan field id
// 	const checkService = await Transaction.findOne({
// 		_id: id,
// 	});

// 	// jika id result false / null maka akan menampilkan error `Tidak ada acara dengan id` yang dikirim client
// 	if (!checkService)
// 		throw new NotFoundError(`Tidak ada acara dengan id :  ${id}`);

// 	// cari Transaction dengan field name dan id selain dari yang dikirim dari params
// 	const check = await Transaction.findOne({
// 		title,
// 		company: req.user.company,
// 		_id: {$ne: id},
// 	});

// 	// apa bila check true / data Transaction sudah ada maka kita tampilkan error bad request dengan message pembicara duplikat
// 	if (check) throw new BadRequestError('judul acara sudah terdaftar');

// 	const result = await Transaction.findOneAndUpdate(
// 		{_id: id},
// 		{
// 			title,
// 			date,
// 			about,
// 			tagline,
// 			venueName,
// 			keyPoint,
// 			statusService,
// 			tickets,
// 			image,
// 			category,
// 			vendor,
// 			company: req.user.company,
// 		},
// 		{new: true, runValidators: true}
// 	);

// 	return result;
// };

// const deleteTransaction = async (req) => {
// 	const {id} = req.params;

// 	const result = await Transaction.findOne({
// 		_id: id,
// 		company: req.user.company,
// 	});

// 	if (!result) throw new NotFoundError(`Tidak ada acara dengan id :  ${id}`);

// 	await result.deleteOne();
// 	// await result.remove();

// 	return result;
// };

// const changeStatusTransaction = async (req) => {
// 	const {id} = req.params;
// 	const {statusService} = req.body;

// 	if (![ 'Draft', 'Published' ].includes(statusService)) {
// 		throw new BadRequestError('Status harus Draft atau Published');
// 	}

// 	// cari Service berdasarkan field id
// 	const checkService = await Transaction.findOne({
// 		_id: id,
// 		company: req.user.company,
// 	});

// 	// jika id result false / null maka akan menampilkan error `Tidak ada acara dengan id` yang dikirim client
// 	if (!checkService)
// 		throw new NotFoundError(`Tidak ada acara dengan id :  ${id}`);

// 	checkService.statusService = statusService;

// 	await checkService.save();

// 	return checkService;
// };



module.exports = {
	// getAllTransaction,
	// createTransaction,
	// getOneTransaction,
	// updateTransaction,
	// deleteTransaction,
	// changeStatusTransaction,
	createStockTransaction,
  rollbackStockTransaction,
};