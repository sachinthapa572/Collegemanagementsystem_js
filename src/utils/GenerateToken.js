import jwt from 'jsonwebtoken';
import Admin from '../model/Staff/Admin.model.js';

import {
	ACCESS_TOKEN_EXPIRES_IN,
	ACCESS_TOKEN_SECRET,
	REFRESH_TOKEN_EXPIRES_IN,
	REFRESH_TOKEN_SECRET,
} from '../constant.js';
import ApiError from './ApiError.js';

const generateAccessTokenAndRefreshToken = async (userId) => {
	try {
		const user = await Admin.findById(userId);
		if (!user) {
			throw new ApiError(404, 'User not found');
		}
		const accessToken = user.generateAccessToken();
		const refreshToken = user.generateRefreshToken();
		Admin.refreshToken = refreshToken;
		await user.save({
			validateBeforeSave: false,
		});
		return {
			refreshToken,
			accessToken,
		};
	} catch (error) {
		throw new ApiError(500, 'Error occured while generating token');
	}
};

export { generateAccessTokenAndRefreshToken };
