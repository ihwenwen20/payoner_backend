const mongoose = require("mongoose");

const incomeSchema = new mongoose.Schema({
	amount: {
		type: Number,
		// required: true,
	},
	otherIncome: {
		type: Number,
	},
	date: {
		type: Date,
		default: new Date(Date.now() + (-1 * new Date().getTimezoneOffset() * 60000)).toISOString(),
		required: true,
	},
	description: {
		type: String,
	},
	totalIncome: {
		type: Number,
		default: 0,
	},
	totalProfit: {
		type: Number,
		default: 0,
	},
	dateFrom: {
		type: Date,
	},
	dateTo: {
		type: Date,
	},
	company: {
		type: mongoose.Types.ObjectId,
		ref: 'Company',
	},
	owner: {
		type: mongoose.Types.ObjectId,
		ref: 'User',
	},
});

// incomeSchema.statics.getIncomeReportByInterval = async function (interval) {
// 	let match = {};
// 	let group = {};

// 	if (interval === "daily") {
// 		match = {
// 			$match: {
// 				date: { $gte: new Date().setHours(0, 0, 0, 0) },
// 			},
// 		};
// 		group = {
// 			_id: { $dayOfMonth: "$date" },
// 			totalIncome: { $sum: { $add: ["$amount", "$otherIncome"] } },
// 			totalProfit: { $sum: "$totalIncome" },
// 			totalOtherIncome: { $sum: "$otherIncome" },
// 		};
// 	} else if (interval === "monthly") {
// 		const startOfMonth = new Date();
// 		startOfMonth.setDate(1);
// 		const endOfMonth = new Date();
// 		endOfMonth.setMonth(endOfMonth.getMonth() + 1, 0);

// 		match = {
// 			$match: {
// 				date: { $gte: startOfMonth, $lt: endOfMonth },
// 			},
// 		};
// 		group = {
// 			_id: { $dayOfMonth: "$date" },
// 			totalIncome: { $sum: { $add: ["$amount", "$otherIncome"] } },
// 			totalProfit: { $sum: "$totalIncome" },
// 			totalOtherIncome: { $sum: "$otherIncome" },
// 		};
// 	}
// 	const result = await this.aggregate([match, { $group: group }]);

// 	return result;
// };

// incomeSchema.pre('aggregate', async function () {
// 	this.pipeline().unshift({
// 		$set: {
// 			// totalIncome: { $sum: '$amount' },
// 						totalIncome: { $sum: { $multiple: ["$amount", "$otherIncome"] } },
// 			totalProfit: { $sum: "$totalIncome" },
// 			totalOtherIncome: { $sum: "$otherIncome" },
// 		},
// 	});
// });
// incomeSchema.index({ company: 1 }, { unique: true });

incomeSchema.statics.getTotalIncome = async function () {
  const totalIncome = await this.aggregate([
		{ $match: '$date' },
    {
      $group: {
        _id: null,
        totalIncome: { $sum: "$totalIncome" }
      }
    }
  ]);

  return totalIncome[0]?.totalIncome || 0;
};

incomeSchema.pre('save', function (next) {
	this.totalOtherIncome = (this.otherIncome || 0);
	this.totalIncome = (this.amount || 0) + (this.otherIncome || 0);
	this.totalProfit = (this.totalIncome || 0);

	next();
});

// incomeSchema.post('save', function (next) {
// 	this.totalOtherIncome = (this.otherIncome || 0);
// 	this.totalIncome = (this.amount || 0) + (this.otherIncome || 0);
// 	this.totalProfit = (this.totalIncome || 0);

// 	next();
// });


module.exports = mongoose.model("Income", incomeSchema);
