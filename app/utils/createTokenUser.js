const createTokenUser = (user) => {
	return {
		userId: user._id,
		username: user.username,
		name: user.name,
		email: user.email,
		role: user.role,
		// owner: user.user._id,
		// companies: user.companies,
		// companies: user.companies.map(company => company._id), // Mengambil array _id dari setiap perusahaan
	};
};

const createTokenCompany = (company) => {
	return {
		companyId: company._id,
		name: company.companyName,
		email: company.email,
		role: company.role,
		owner: company.owner,
	};
};

const createTokenCustomer = (customer) => {
	return {
		customerId: customer._id,
		firstName: customer.firstName,
		lastName: customer.lastName,
		email: customer.email,
	};
};

module.exports = { createTokenUser, createTokenCompany, createTokenCustomer };
