import { Router } from 'express';
import {
	createAcademicYear,
	deleteAcademicYear,
	getAcademicYearById,
	getAcademicYears,
	updateAcademicYear,
} from '../../controller/academics/academicYear.controller.js';
import { isAdmin } from '../../middlewares/isAdmin.middleware.js';
import { isAuth } from '../../middlewares/isAuth.middleware.js';
import validateObjectId from '../../middlewares/validateObjectId.middleware.js';

const academicYearRouter = Router();

academicYearRouter.use(isAuth, isAdmin);

// create the academic year
academicYearRouter
	.route('/')
	.post(createAcademicYear)
	.get(getAcademicYears);

// get academic year by id
academicYearRouter
	.route('/:id')
	.get(validateObjectId, getAcademicYearById)
	.put(validateObjectId, updateAcademicYear)
	.delete(validateObjectId, deleteAcademicYear);

export default academicYearRouter;
