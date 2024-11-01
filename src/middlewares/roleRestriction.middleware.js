import ApiError from '../utils/ApiError.js';
import removeMulterUploadFiles from '../utils/Images/removeMulterUploadFiles.js';

export const roleRestriction = (...roles) => {
	return (req, _, next) => {
		if (roles.includes(req.user.role)) {
			next();
		} else {
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
