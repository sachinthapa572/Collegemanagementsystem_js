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

// create the academic year
academicYearRouter
	.route('/')
	.post(isAuth, isAdmin, createAcademicYear)
	.get(isAuth, isAdmin, getAcademicYears);

// get academic year by id
academicYearRouter
	.route('/:id')
	.get(isAuth, isAdmin, validateObjectId, getAcademicYearById);

// check
// update academic year by id
academicYearRouter
	.route('/:id')
	.put(isAuth, isAdmin, validateObjectId, updateAcademicYear);

// delete academic year by id
academicYearRouter
	.route('/:id')
	.delete(isAuth, isAdmin, validateObjectId, deleteAcademicYear);

export default academicYearRouter;
