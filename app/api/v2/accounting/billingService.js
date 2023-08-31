const createBill = async (req) => {
	const { customerId, invoiceNumber, invoiceDate, dueDate, totalAmount } = req.body;

	const newBill = new Bill({
		customerId,
		invoiceNumber,
		invoiceDate,
		dueDate,
		totalAmount,
		paymentStatus: 'pending',
		isAutoGenerated: true,
	});

	try {
		await newBill.save();
		return newBill;
	} catch (err) {
		throw err;
	}
};

const getBillById = async (billId) => {
	const bill = await Bill.findById(billId);
	if (!bill) {
		throw new NotFoundError(`Bill with ID ${billId} not found.`);
	}
	return bill;
};

const getAllBills = async () => {
	const bills = await Bill.find();
	return bills;
};

const updateBill = async (billId, req) => {
	const bill = await Bill.findById(billId);
	if (!bill) {
		throw new NotFoundError(`Bill with ID ${billId} not found.`);
	}

	for (const [key, value] of Object.entries(req.body)) {
		bill[key] = value;
	}

	try {
		await bill.save();
		return bill;
	} catch (err) {
		throw err;
	}
};

const deleteBill = async (billId) => {
	const bill = await Bill.findById(billId);
	if (!bill) {
		throw new NotFoundError(`Bill with ID ${billId} not found.`);
	}

	try {
		await bill.remove();
		return true;
	} catch (err) {
		throw err;
	}
};

// const generateBills = async () => {
//   const bills = await Bill.find({ paymentStatus: 'pending' });
//   for (const bill of bills) {
//     if (bill.dueDate < new Date()) {
//       bill.paymentStatus = 'overdue';
//       await bill.save();
//     } else if (bill.dueDate < bill.autoGenerateDate + 30) {
//       bill.isAutoGenerated = true;
//       await bill.save();
//     }
//   }
// };

const generateBills = async () => {
	const bills = await Bill.find({ paymentStatus: 'pending' });
	for (const bill of bills) {
		if (bill.dueDate < bill.autoGenerateDate + bill.autoGenerateDays) {
			bill.isAutoGenerated = true;
			if (bill.paymentStatus === 'pending') {
				bill.customer.isSuspended = true;
			}
			await bill.save();
		}
	}
};