const Income = require('./model');
const Orders = require('../../orders/model')

const getBalanceReport = async (req, res, interval) => {
	console.log('req', req.company)
	const check = await Orders.find({
		company: req.company.id,
		status: 'Paid'
	})
	// check.forEach(order => {
	// 	console.log('title', order.company);
	// });
	// const companyIds = check.map(order => order.company); // Menyimpan semua company IDs dari array check

	const check2 = await Income.find({
		// company: { $in: companyIds }
		company: req.company.id
	})
	// console.log('interval', interval)
	// console.log('check', check2)
	const totalIncome = await Income.aggregate([
		{
			$group: {
				_id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
				totalIncome: { $sum: "$totalIncome" }
			}
		}
	]);
	// const totalIncome = check2.reduce((sum, income) => sum + income.totalIncome, 0);

	res.status(200).json({
		check2,
		totalIncome,
	});
};

const getIncomeReport = async (interval) => {
	console.log('interval', interval)
	let match = {};
	let group = {};

	if (interval === "daily") {
		match = {
			$match: {
				date: { $gte: new Date().setHours(0, 0, 0, 0) },
			},
		};
		group = {
			// _id: { $dayOfMonth: "$date" },
			_id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
			totalIncome: { $sum: { $multiply: ["$amount", "$otherIncome"] } },
			totalProfit: { $sum: "$totalIncome" },
			totalOtherIncome: { $sum: "$otherIncome" },
		};
	} else if (interval === "monthly") {
		const startOfMonth = new Date();
		startOfMonth.setDate(1);
		const endOfMonth = new Date();
		endOfMonth.setMonth(endOfMonth.getMonth() + 1, 0);

		// match = {
		//   $match: {
		//     date: { $gte: new Date().setDate(1), $lt: new Date().setMonth(new Date().getMonth() + 1, 0) },
		//   },
		// };
		match = {
			$match: {
				date: { $gte: startOfMonth, $lt: endOfMonth },
			},
		};
		group = {
			_id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
			totalIncome: { $sum: { $multiply: ["$amount", "$otherIncome"] } },
			totalProfit: { $sum: "$totalIncome" },
			totalOtherIncome: { $sum: "$otherIncome" },
		};
	}
	// Add more cases for other intervals

	const result = await Income.aggregate([
		match,
		{
			$group: group,
		},
		// {
		// 	$group: {
		// 		_id: null,
		// 		totalIncome: { $sum: "$totalAmount" },
		// 	},
		// },
	]);

	console.log('match', match)
	console.log('group', group)
	console.log('result', result)

	// const totalIncome = result.length > 0 ? result[0].totalIncome : 0;
	// return { totalIncome, incomeByInterval: result };
	return result
};

const createIncome = async (req, res, next) => {
	try {
		const result = new Income({
			...req.body,
			company: req.body.company,
		});

		await result.save();
		res.status(StatusCodes.OK).json(result);
	} catch (err) {
		next(err);
	}
};

module.exports = {
	getIncomeReport, createIncome,
	getBalanceReport,
};