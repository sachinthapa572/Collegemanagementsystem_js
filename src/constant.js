export const MONGO_CONNECTION_STRING = String(process.env.MONGO_URI);
export const MONGO_DB_NAME = String(process.env.MONGO_DB_NAME);
export const PORT = Number(process.env.PORT);
export const NODE_ENV = String(process.env.NODE_ENV);

export const ACCESS_TOKEN_SECRET = String(process.env.ACCESS_TOKEN_SECRET);
export const ACCESS_TOKEN_EXPIRES_IN = String(process.env.ACCESS_TOKEN_EXPIRES_IN);
export const REFRESH_TOKEN_SECRET = String(process.env.REFRESH_TOKEN_SECRET);
export const REFRESH_TOKEN_EXPIRES_IN = String(process.env.REFRESH_TOKEN_EXPIRES_IN);


export const cookiesOptions = {
	httpOnly: true,
	secure: true,
};
