import mongoose from 'mongoose';

// this function ensures that if any error occurs during the execution of the handler function, the transaction is aborted and it roll back to the previous state.

async function withTransaction(handler) {
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		// execute the function
		const result = await handler(session);
		// only save the transaction if the handler does not throw an error
		await session.commitTransaction();
		return result;
	} catch (error) {
		// Abort transaction on error
		await session.abortTransaction();
		throw error;
	} finally {
		// Always end the session
		session.endSession();
	}
}

export default withTransaction;
