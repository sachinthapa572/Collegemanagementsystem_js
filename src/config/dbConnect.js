import { connect } from 'mongoose';
import { environmentVariables } from '../constant.js';

export const dbConnect = async () => {
	// console.log(process.env);
	try {
		const ConnectionInstnance = await connect(
			`${environmentVariables.MONGO_CONNECTION_STRING}/${environmentVariables.MONGO_DB_NAME}`
		);
		console.log(
			`MongoDB Connected: ${ConnectionInstnance.connection.name}`
		);
	} catch (error) {
		console.log('Error connecting to MongoDB', error.message);
	}
};
