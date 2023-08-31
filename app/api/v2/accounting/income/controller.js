const { getIncomeReport } = require("./income");

const daily = async (req, res, next) => {
	try {
		const dailyIncomeReport = await getIncomeReport("daily");
		console.log("Daily Income Report:", dailyIncomeReport);
		res.status(StatusCodes.OK).json({
			dailyIncomeReport
		});
	} catch (err) {
		next(err);
	}
};

const monthly = async (req, res, next) => {
	try {
		const monthlyIncomeReport = await getIncomeReport("monthly");
		console.log("Monthly Income Report:", monthlyIncomeReport);
		res.status(StatusCodes.OK).json({
			dailyIncomeReport
		});
	} catch (err) {
		next(err);
	}
};

module.exports = {
	daily,
	monthly
};