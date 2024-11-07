import jwt from 'jsonwebtoken';
import {
	cookiesOptions,
	environmentVariables,
	roles,
} from '../constant.js';
import { generateAccessTokenAndRefreshToken } from '../utils/authTokenGenerator.js';
import ApiError from '../utils/ApiError.js';
import Admin from '../model/Staff/Admin.model.js';
import Teacher from '../model/Staff/Teacher.model.js';

const refreshTokenMiddleware = async (req, res, next) => {
	const accessToken =
		req.cookies.accessToken ||
		req.header('Authorization')?.replace(/^Bearer\s*/, '');
	// x-refresh-token is used for the refresh token in the header
	const refreshToken =
		req.cookies.refreshToken || req.header('x-refresh-token');

	// Check if access token is missing but refresh token exists
	if (!accessToken && refreshToken) {
		try {
			const decodedToken = jwt.verify(
				refreshToken,
				environmentVariables.REFRESH_TOKEN_SECRET
			);

			const model =
				decodedToken.role.charAt(0).toUpperCase() +
				decodedToken.role.slice(1);

			// Generate a new access token and refresh token
			//! add the student schema in the null place
			const {
				accessToken: newAccessToken,
				refreshToken: newRefreshToken,
			} = await generateAccessTokenAndRefreshToken(
				model === roles.ADMIN
					? Admin
					: model === roles.TEACHER
						? Teacher
						: null,
				decodedToken._id,
				next
			);

			// Set the new accessToken and refreshToken in the response object
			res.cookie(
				'accessToken',
				newAccessToken,
				cookiesOptions
			).cookie('refreshToken', newRefreshToken, cookiesOptions);

			// Set the new accessToken in the request object
			req.cookies.accessToken = newAccessToken;
		} catch (error) {
			return next(
				new ApiError(401, 'Unauthorized: Unable to refresh token')
			);
		}
	}
	next();
};

export default refreshTokenMiddleware;
