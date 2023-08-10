const createTokenUser = (user) => {
	return {
		name: user.name,
		userId: user._id,
		role: user.role,
		email: user.email,
		company: user.company,
	};
};

const createTokenCustomer = (customer) => {
	return {
		lastName: customer.lastName,
		customerId: customer._id,
		firstName: customer.firstName,
		email: customer.email,
	};
};

// module.exports = {createTokenUser};
module.exports = {createTokenUser, createTokenCustomer};
