export const globalErrHandeler = (err, req, res, next) => {
	const statusCode = err?.statusCode || 500;
	const status = err?.status || 'failed';
	res.status(statusCode).json({
		status,
		message: err.message,
		stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
	});
};

// Not found route handler

export const notFoundErr = (req, res, next) => {
	const err = new Error(
		`Not Found - ${req.originalUrl} on the server`
	);
	next(err);
};
