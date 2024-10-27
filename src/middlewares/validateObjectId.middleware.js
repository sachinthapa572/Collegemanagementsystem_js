import { ObjectId } from 'mongodb';
import ApiError from '../utils/ApiError.js';

const validateObjectId = (req, res, next) => {
	const id = req.params.id || req.query.id || req.body._id;

	if (id) {
		// Check if it's a valid ObjectId
		if (!ObjectId.isValid(id)) {
			next(new ApiError(400, 'Invalid ID provided'));
		}
		req.params.id = ObjectId.createFromHexString(id);
	}

	next();
};

export default validateObjectId;
