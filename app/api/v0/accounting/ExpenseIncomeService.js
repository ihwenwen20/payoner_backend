const calculateIncome = (transactions) => {
	let total = 0;
	for (const transaction of transactions) {
		if (transaction.type === 'income') {
			total += transaction.amount;
		}
	}
	return total;
};

const calculateExpense = (transactions) => {
	let total = 0;
	for (const transaction of transactions) {
		if (transaction.type === 'expense') {
			total += transaction.amount;
		}
	}
	return total;
};

const calculateBalance = (income, expense) => {
	return income - expense;
};

const createAccounting = async (req) => {
	const { type, billId, amount, date, description, totalIncome, totalExpenditure, sales, expenseList, company, tax, otherCosts, dateFrom, dateTo } = req.body;

	const newAccounting = new Accounting({
		type,
		billId,
		amount,
		date,
		description,
		totalIncome,
		totalExpenditure,
		sales,
		expenseList,
		company,
		tax,
		otherCosts,
		dateFrom,
		dateTo,
	});

	// Calculate total income
	if (type === 'income') {
		newAccounting.totalIncome += amount - tax - otherCosts;
	}

	// Calculate total expenditure
	if (type === 'expense') {
		newAccounting.totalExpenditure += amount - tax - otherCosts;
	}

	try {
		await newAccounting.save();
		return newAccounting;
	} catch (err) {
		throw err;
	}
};

const getProfitAndLoss = async (accountingId, dateFrom, dateTo) => {
	const accounting = await Accounting.findById(accountingId);
	if (!accounting) {
		throw new NotFoundError(`Accounting with ID ${accountingId} not found.`);
	}

	const profit = accounting.totalIncome - accounting.totalExpenditure - accounting.tax - accounting.otherCosts;
	return profit;
};

const daily = async (req) => {

	const accountings = await Accounting.find({
		date: {
			"$gte": new Date(),
			"$lt": new Date().addDays(1),
		},
	});

	const dailyProfits = accountings.reduce((acc, accounting) => {
		acc[accounting.date] = acc[accounting.date] || 0;
		acc[accounting.date] += accounting.totalIncome - accounting.totalExpenditure;
		return acc;
	}, {});
}

const week = async (req) => {

	const accountings = await Accounting.find({
		date: {
			"$gte": new Date().startOfWeek(),
			"$lt": new Date().endOfWeek(),
		},
	});

	const weeklyProfits = accountings.reduce((acc, accounting) => {
		acc[accounting.date] = acc[accounting.date] || 0;
		acc[accounting.date] += accounting.totalIncome - accounting.totalExpenditure;
		return acc;
	}, {});
}

const monthly = async (req) => {

	const accountings = await Accounting.find({
		date: {
			"$gte": new Date().startOfMonth(),
			"$lt": new Date().endOfMonth(),
		},
	});

	const monthlyProfits = accountings.reduce((acc, accounting) => {
		acc[accounting.date] = acc[accounting.date] || 0;
		acc[accounting.date] += accounting.totalIncome - accounting.totalExpenditure;
		return acc;
	}, {});
}

const monthlyKemarin = async (req) => {

	const accountings = await Accounting.find({
		date: {
			"$gte": new Date().startOfYear(),
			"$lt": new Date().endOfYear(),
		},
	});

	const yearlyProfits = accountings.reduce((acc, accounting) => {
		acc[accounting.date] = acc[accounting.date] || 0;
		acc[accounting.date] += accounting.totalIncome - accounting.totalExpenditure;
		return acc;
	}, {});
}



const exportTransactionsToCSV = (transactions) => {
	const csv = `
    type,amount,date,description
  `;
	for (const transaction of transactions) {
		csv += `
      ${transaction.type},${transaction.amount},${transaction.date},${transaction.description}
    `;
	}
	return csv;
};

const exportTransactionsToJSON = (transactions) => {
	const json = JSON.stringify(transactions, null, 2);
	return json;
};
// Fungsi exportTransactionsToCSV() digunakan untuk mengekspor data transaksi ke file CSV. Fungsi ini menerima array transaksi sebagai parameter dan mengembalikan string CSV yang berisi data transaksi.

// Fungsi exportTransactionsToJSON() digunakan untuk mengekspor data transaksi ke file JSON. Fungsi ini menerima array transaksi sebagai parameter dan mengembalikan string JSON yang berisi data transaksi.