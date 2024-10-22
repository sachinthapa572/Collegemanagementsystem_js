class ApiError extends Error {
	constructor(
		statusCode,
		message = 'Something went wrong',
		errors = []
	) {
		super(message);
		this.statusCode = statusCode;
		this.success = false;
		this.errors = errors;
		this.status = `${statusCode}`.startsWith('4')
			? 'fail'
			: 'error';
		Error.captureStackTrace(this, this.constructor);
	}
}

export default ApiError;
