import { connect } from 'mongoose';
import {
	MONGO_CONNECTION_STRING,
	MONGO_DB_NAME,
} from '../constant.js';

export const dbConnect = async () => {
	// console.log(process.env);
	try {
		const ConnectionInstnance = await connect(
			`${MONGO_CONNECTION_STRING}/${MONGO_DB_NAME}`
		);
		console.log(
			`MongoDB Connected: ${ConnectionInstnance.connection.name}`
		);
	} catch (error) {
		console.log('Error connecting to MongoDB', error.message);
	}
};
