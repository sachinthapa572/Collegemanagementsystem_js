import { environmentVariables } from '../constant.js';
import ApiError from '../utils/ApiError.js';
import jwt from 'jsonwebtoken';

const verifyJWT = (model) => {
	return async (req, _, next) => {
		try {
			const token =
				req.cookies?.accessToken ||
				req
					.header('Authorization')
					?.replace(/^Bearer\s*/, '')
					.trim();

			if (!token || token === 'undefined') {
				return next(
					new ApiError(
						401,
						'Unauthorized request: No token provided'
					)
				);
			}

			const decodedToken = jwt.verify(
				token,
				environmentVariables.ACCESS_TOKEN_SECRET
			);
			const _id = decodedToken?._id;
			const user = await model
				.findById(_id)
				.select('-password -refreshToken');

			if (!user) {
				return next(
					new ApiError(
						401,
						'Unauthorized request: User not found'
					)
				);
			}

			req.user = user;
			next();
		} catch (error) {
			if (
				error.name === 'JsonWebTokenError' ||
				error.name === 'TokenExpiredError'
			) {
				return next(
					new ApiError(
						401,
						'Unauthorized request: Invalid or expired access token'
					)
				);
			}
			return next(new ApiError(500, 'Internal Server Error'));
		}
	};
};

export { verifyJWT as isAuth };
