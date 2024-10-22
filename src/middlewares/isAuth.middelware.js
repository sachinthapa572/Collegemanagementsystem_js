import { ACCESS_TOKEN_SECRET } from '../constant.js';
import Admin from '../model/Staff/Admin.model.js';
import ApiError from '../utils/ApiError.js';
import jwt from 'jsonwebtoken';

const verifyJWT = async (req, _, next) => {
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

		const decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET);
		const _id = decodedToken?._id;
		const user = await Admin.findById(_id).select(
			'-password -refreshToken'
		);

		if (!user) {
			return next(
				new ApiError(401, 'Unauthorized request: User not found')
			);
		}

		req.user = user;
		next();
	} catch (error) {
		return next(
			new ApiError(
				401,
				'Unauthorized request: Invalid or expired access token'
			)
		);
	}
};

export { verifyJWT };
