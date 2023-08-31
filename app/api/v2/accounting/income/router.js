const express = require("express");
const router = express.Router();
const { getIncomeReport, createIncome, getBalanceReport} = require("./income");
const Income = require('./model');
// const { create, index, find, update, destroy } = require('./controller');

const {
	authenticateCompany,
	authorizeRolesCompany,
} = require('../../../../middlewares/auth');

router.get('/income', authenticateCompany, authorizeRolesCompany('Developer', 'Owner', 'Company', 'Admin'), getBalanceReport);
// router.post('/income', authenticateCompany, authorizeRolesCompany('Developer', 'Owner', 'Company', 'Admin'), create);
// router.get('/income/:id', authenticateCompany, authorizeRolesCompany('Developer', 'Owner', 'Company', 'Admin'), find);
// router.put('/income/:id', authenticateCompany, authorizeRolesCompany('Developer', 'Owner', 'Company', 'Admin'), update);
// router.delete('/income/:id', authenticateCompany, authorizeRolesCompany('Developer', 'Owner', 'Company', 'Admin'), destroy);

router.get("/income/report/:interval", async (req, res) => {
	try {
		const { interval } = req.params; // Mengambil nilai interval dari URL
		const incomeReport = await getIncomeReport(interval);
		res.json({ success: true, data: incomeReport });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

router.post("/income", async (req, res) => {
	try {
		const income = new Income({
			...req.body,
			date: Date.now(),
			company: req.body.company,
		});

		await income.save();
		res.json({ success: true, data: income });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

router



module.exports = router;