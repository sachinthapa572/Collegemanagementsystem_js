import { NODE_ENV } from '../constant.js';
import ApiError from '../utils/ApiError.js';

export const globalErrHandler = (err, req, res, next) => {
	// If the error is not an instance of ApiError, convert it into one
	if (!(err instanceof ApiError)) {
		err = new ApiError(500, err.message || 'Internal Server Error');
	}

	const statusCode = err.statusCode || 500; // 'fail' for 4xx, 'error' for 5xx
	const status = err.status || 'error';

	res.status(statusCode).json({
		status,
		message: err.message,
		success: err.success,
		errors: err.errors,
		stack: NODE_ENV === 'production' ? undefined : err.stack,
	});
};

// Not Found route handler
export const notFoundErr = (req, res, next) => {
	const err = new ApiError(
		404,
		`Not Found - ${req.originalUrl} on the server`
	);
	next(err);
};
