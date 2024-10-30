import { Router } from 'express';
import { isAuth } from '../../middlewares/isAuth.middleware.js';
import { isAdmin } from '../../middlewares/isAdmin.middleware.js';
import validateObjectId from '../../middlewares/validateObjectId.middleware.js';
import {
	createClassLevel,
	deleteClassLevel,
	getClassLevelById,
	getClassLevels,
	updateClassLevel,
} from '../../controller/academics/classLevel.controller.js';
import Admin from '../../model/Staff/Admin.model.js';

const classLevelRouter = Router();

classLevelRouter.use(isAuth(Admin), isAdmin);

// create and get all academic years
classLevelRouter
	.route('/')
	.post(createClassLevel)
	.get(getClassLevels);

// get, update and delete the academic year
classLevelRouter
	.route('/:id')
	.get(validateObjectId, getClassLevelById)
	.put(validateObjectId, updateClassLevel)
	.delete(validateObjectId, deleteClassLevel);

export default classLevelRouter;
