import ApiError from '../utils/ApiError.js';
import removeMulterUploadFiles from '../utils/Images/removeMulterUploadFiles.js';

/**
 * Middleware to restrict access to specific routes based on user roles.
 * 
 * @param {...string} roles - List of roles that are allowed to access the route.
 * @returns {function} Middleware function to check user role and handle access.
 */
export const roleRestriction = (...roles) => {
	return (req, _, next) => {
		// Check if the user's role is included in the allowed roles
		if (roles.includes(req.user.role)) {
			next();
		} else {
			// If the user's role is not included, remove any uploaded files and call next with an ApiError
			if (req.file) {
				removeMulterUploadFiles(req.file.path);
			}
			next(
				new ApiError(
					403,
					"You don't have permission to access this action"
				)
			);
		}
	};
};
