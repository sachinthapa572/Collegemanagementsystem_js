import ApiError from './ApiError.js';

const generateAccessTokenAndRefreshToken = async (model, userId) => {
	console.log('model', model);
	try {
		const user = await model.findById(userId);
		if (!user) {
			throw new ApiError(404, 'User not found');
		}
		const accessToken = user.generateAccessToken();
		const refreshToken = user.generateRefreshToken();

		user.refreshToken = refreshToken;
		await user.save({
			validateBeforeSave: false,
		});

		return {
			refreshToken,
			accessToken,
		};
	} catch (error) {
		throw new ApiError(
			500,
			'Error occurred while generating token'
		);
	}
};

export { generateAccessTokenAndRefreshToken };
