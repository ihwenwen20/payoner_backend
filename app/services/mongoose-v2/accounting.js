const Accounting = require('../../api/v2/accounting/model')
const Orders = require('../../api/v2/orders/model');
const { NotFoundError, BadRequestError, DuplicateError } = require('../../errors');
const { paginate } = require('../../utils/paginationUtils');

const getAllIncome = (req,transactions) => {
	let total = 0;
	for (const transaction of transactions) {
		if (transaction.type === 'Income') {
			total += transaction.amount;
		}
	}
	return total;
};

const getAllExpense = (transactions) => {
	let total = 0;
	for (const transaction of transactions) {
		if (transaction.type === 'Expense') {
			total += transaction.amount;
		}
	}
	return total;
};

const calculateBalance = (Income, Expense) => {
	return Income - Expense;
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
	if (type === 'Income') {
		newAccounting.totalIncome += amount - tax - otherCosts;
	}

	// Calculate total expenditure
	if (type === 'Expense') {
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

const dailyProfits = async (req) => {

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

const weeklyProfits = async (req) => {
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

const monthlyProfits = async (req) => {

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

module.exports = {
	getAllIncome,
	getAllExpense,
	getProfitAndLoss,
	createAccounting,
	calculateBalance,
	dailyProfits,
	weeklyProfits,
	monthlyProfits,
	monthlyKemarin,
	exportTransactionsToCSV,
	exportTransactionsToJSON,
}