import { Router } from 'express';
import { isAuth } from '../../middlewares/isAuth.middleware.js';
import validateObjectId from '../../middlewares/validateObjectId.middleware.js';
import Admin from '../../model/Staff/Admin.model.js';
import { roleRestriction } from '../../middlewares/roleRestriction.middleware.js';
import {
	createSubject,
	deleteSubject,
	getSubjects,
	updateSubject,
} from '../../controller/academics/subject.controller.js';

const subjectRouter = Router();

subjectRouter.use(isAuth(Admin), roleRestriction('admin'));

subjectRouter
	.route('/:programId')
	.post(createSubject)
	.get(getSubjects);

subjectRouter
	.route('/:programId')
	.put(validateObjectId, updateSubject)
	.delete(validateObjectId, deleteSubject);

export default subjectRouter;

//* @ route POST /api/v1/academics/subject/:programId
//* @ route GET /api/v1/academics/subjects/:programId?academicTerm=termId&academicYear=year&subjectId=subjectId
//* @ route PUT /api/v1/academics/subjects/:programId?academicTerm=termId&academicYear=year&subjectId=subjectId
//* @ route DELETE /api/v1/academics/subjects/:programId?academicTerm=termId&academicYear=year&subjectId=subjectId
