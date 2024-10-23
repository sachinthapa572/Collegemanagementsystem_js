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
