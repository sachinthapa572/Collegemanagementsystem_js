import ApiError from './utils/ApiError.js';

export const environmentVariables = Object.freeze({
	PORT: Number(process.env.PORT),
	NODE_ENV: String(process.env.NODE_ENV),

	//* mongo config
	MONGO_CONNECTION_STRING: String(process.env.MONGO_URI),
	MONGO_DB_NAME: String(process.env.MONGO_DB_NAME),

	//* jwt config
	ACCESS_TOKEN_SECRET: String(process.env.ACCESS_TOKEN_SECRET),
	ACCESS_TOKEN_EXPIRES_IN: String(
		process.env.ACCESS_TOKEN_EXPIRES_IN
	),
	REFRESH_TOKEN_SECRET: String(process.env.REFRESH_TOKEN_SECRET),
	REFRESH_TOKEN_EXPIRES_IN: String(
		process.env.REFRESH_TOKEN_EXPIRES_IN
	),

	//* cloudinary config
	CLOUD_NAME: String(process.env.CLOUD_NAME),
	CLOUDINARY_NAME: String(process.env.CLOUDINARY_NAME),
	CLOUDINARY_API_KEY: String(process.env.CLOUDINARY_API_KEY),
	CLOUDINARY_API_SECRET: String(process.env.CLOUDINARY_API_SECRET),
});

// cookies config
export const cookiesOptions = Object.freeze({
	httpOnly: true,
	secure: true,
});

export const allowedTypesFileTypes = Object.freeze([
	'image/jpeg',
	'image/png',
	'image/jpg',
]);

const allowedOrigins = Object.freeze([
	'http://localhost:3000',
	'http://localhost:5137',
]);

export const corsOptions = Object.freeze({
	origin: function (origin, callback) {
		if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
			callback(null, true);
		} else {
			callback(new ApiError('Not allowed by CORS'));
		}
	},
	credentials: true,
});

export const examState = Object.freeze([
	'ongoing',
	'completed',
	'cancelled',
]);

export const rateLimitOptions = Object.freeze({
	windowMs: 15 * 60 * 1000,
	limit: 100,
	standardHeaders: 'draft-7',
	legacyHeaders: false,
});

export const roles = Object.freeze({
	ADMIN: 'Admin',
	TEACHER: 'Teacher',
	STUDENT: 'Student',
});

// student image directory

export const studentImageDirectory = (AcademicYear) => {
	return `students/${AcademicYear}`;
};
