import ApiError from '../utils/ApiError.js';

export const isAdmin = async (req, res, next) => {
	const { role } = req.user;
	if (role !== 'admin') {
		next(new ApiError(403, 'Forbidden: You are not an admin'));
	}
	next();
};
