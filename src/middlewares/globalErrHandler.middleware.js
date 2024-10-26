import { environmentVariables } from '../constant.js';
import ApiError from '../utils/ApiError.js';
import multer from 'multer';
import { z } from 'zod';
import removeMulterUploadFiles from '../utils/Images/removeMulterUploadFiles.js';

const globalErrHandler = (err, req, res, next) => {
	// Multer error
	if (err instanceof multer.MulterError) {
		let message;
		switch (err.code) {
			case 'LIMIT_FILE_SIZE':
				message = 'File size is too large. Max file size is 5MB.';
				break;
			case 'LIMIT_FILE_COUNT':
				message = 'Too many files uploaded.';
				break;
			case 'LIMIT_UNEXPECTED_FILE':
				message = 'Unexpected file format or field name.';
				break;
			default:
				message = 'An error occurred during file upload.';
		}

		err = new ApiError(400, message);
		next(err);
	}

	// zod validation error
	if (err instanceof z.ZodError) {
		const errors = err.errors.map((error) => {
			const { path, message } = error;
			return { path, message };
		});

		err = new ApiError(
			400,
			'Invalid data. Please check your data',
			errors
		);

		if (req.file) {
			removeMulterUploadFiles(req.file.path);
		}
		next(err);
	}

	// If the error is not an instance of ApiError, convert it into one
	if (!(err instanceof ApiError)) {
		err = new ApiError(500, err.message || 'Internal Server Error');
	}

	const statusCode = err.statusCode || 500;
	const status = statusCode >= 500 ? 'error' : 'fail'; // Fail for 4xx, Error for 5xx

	res.status(statusCode).json({
		status,
		message: err.message,
		success: err.success,
		errors: err.errors,
		stack:
			environmentVariables.NODE_ENV === 'production'
				? undefined
				: err.stack,
	});
};

// Not Found route handler
const notFoundErr = (req, _, next) => {
	const err = new ApiError(
		404,
		`Not Found - ${req.originalUrl} on the server`
	);
	next(err);
};

export { globalErrHandler, notFoundErr };
