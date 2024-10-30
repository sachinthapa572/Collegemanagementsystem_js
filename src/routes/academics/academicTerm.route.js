import { Router } from 'express';
import { isAuth } from '../../middlewares/isAuth.middleware.js';
import { isAdmin } from '../../middlewares/isAdmin.middleware.js';
import {
	createAcademicTerm,
	deleteAcademicTerm,
	getAcademicTermById,
	getAcademicTerms,
	updateAcademicTerm,
} from '../../controller/academics/academicTerm.controller.js';
import validateObjectId from '../../middlewares/validateObjectId.middleware.js';
import Admin from '../../model/Staff/Admin.model.js';

const academicTermRouter = Router();

academicTermRouter.use(isAuth(Admin), isAdmin);

// create and get all academic years
academicTermRouter
	.route('/')
	.post(createAcademicTerm)
	.get(getAcademicTerms);

// get, update and delete the academic year
academicTermRouter
	.route('/:id')
	.get(validateObjectId, getAcademicTermById)
	.put(validateObjectId, updateAcademicTerm)
	.delete(validateObjectId, deleteAcademicTerm);

export default academicTermRouter;
