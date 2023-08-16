const Users = require('../../api/v2/users/model');

const { NotFoundError, BadRequestError } = require('../../errors');
const { paginateData, infiniteScrollData } = require('../../utils/paginationUtils');

const getAllUsers = async (req, queryFields, search, page, size) => {
	const result = await paginateData(Users, queryFields, search, page, size);
	const populateOptions = [
		// {
		// 	path: 'company',
		// 	select: 'companyName',
		// },
		{
			path: 'contact',
			select: 'phone address',
		},
		{
			path: 'avatar',
			select: '_id url',
		}
	];

	await Users.populate(result.data, populateOptions);

	return result;
};

const getAllUsers2 = async (req, queryFields, search, page, size) => {
	const result = await infiniteScrollData(Users, queryFields, search, page, size);
	const populateOptions = [
		// {
		// 	path: 'company',
		// 	select: 'companyName',
		// },
		{
			path: 'contact',
			select: 'phone address',
		},
		{
			path: 'avatar',
			select: '_id url',
		}
	];

	await Users.populate(result.data, populateOptions);

	return result;
};




module.exports = {
	getAllUsers,
	getAllUsers2,
	// createUser,
	// changeStatusUser,
	// getDetailUser,
	// updateUser,
	// deleteUser
};
