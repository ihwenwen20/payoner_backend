const UserRefreshToken = require('../../api/v2/userRefreshToken/model');
const {
	isTokenValidRefreshToken,
	createJWT,
	createRefreshJWT,
} = require('../../utils/jwt');
const {
	createTokenUser,
} = require('../../utils/createTokenUser');
const Users = require('../../api/v2/users/model');
const {NotFoundError} = require('../../errors');

const createUserRefreshToken = async (payload) => {
	const result = await UserRefreshToken.create(payload);

	return result;
};

const getUserRefreshToken = async (req) => {
	const {refreshToken} = req.params;
	const result = await UserRefreshToken.findOne({
		refreshToken,
	});

	if (!result) throw new NotFoundError('refreshToken invalid');

	const payload = isTokenValidRefreshToken({token: result.refreshToken});

	const userCheck = await Users.findOne({email: payload.email});

	const token = createJWT({payload: createTokenUser(userCheck)});

	const newrefreshToken = createRefreshJWT({payload: createTokenUser(result)});
	await createUserRefreshToken({
		refreshToken,
		user: result._id,
	});

	return {token, refreshtoken: newrefreshToken};
	// return token;
};

module.exports = {createUserRefreshToken, getUserRefreshToken};
