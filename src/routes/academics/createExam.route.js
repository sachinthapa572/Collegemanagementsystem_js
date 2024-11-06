import { Router } from 'express';
import { isAuth } from '../../middlewares/isAuth.middleware.js';
import Teacher from '../../model/Staff/Teacher.model.js';
import {
	createExamController,
	deleteExamController,
	getExamsController,
	updateExamController,
} from '../../controller/academics/createExam.controller.js';
import validateObjectId from '../../middlewares/validateObjectId.middleware.js';
import { roleRestriction } from '../../middlewares/roleRestriction.middleware.js';

const createExamRouter = Router();

createExamRouter.use(isAuth(Teacher), roleRestriction('teacher'));

createExamRouter
	.route('/')
	.post(createExamController)
	.get(getExamsController);
createExamRouter
	.route('/:examId')
	.get(validateObjectId, getExamsController);

createExamRouter
	.route('/:examId')
	.put(validateObjectId, updateExamController)
	.delete(validateObjectId, deleteExamController);

export default createExamRouter;
