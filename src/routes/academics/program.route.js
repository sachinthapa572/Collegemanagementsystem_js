import { Router } from 'express';
import { isAdmin } from '../../middlewares/isAdmin.middleware.js';
import { isAuth } from '../../middlewares/isAuth.middleware.js';
import validateObjectId from '../../middlewares/validateObjectId.middleware.js';
import {
	createProgram,
	deleteProgram,
	getProgramById,
	getPrograms,
	updateProgram,
} from '../../controller/academics/program.controller.js';
import Admin from '../../model/Staff/Admin.model.js';

const programRouter = Router();

programRouter.use(isAuth(Admin), isAdmin);

programRouter.route('/').post(createProgram).get(getPrograms);

programRouter
	.route('/:id')
	.get(validateObjectId, getProgramById)
	.put(validateObjectId, updateProgram)
	.delete(validateObjectId, deleteProgram);

export default programRouter;
