import { Router } from 'express';
import { isAuth } from '../../middlewares/isAuth.middleware.js';
import Admin from '../../model/Staff/Admin.model.js';
import { uploadFileMulter } from '../../middlewares/multer.middleware.js';
import {
	DeleteStudentController,
	GetAllStudentsController,
	GetStudentByIdController,
	GetStudentDetailsController,
	LoginStudentController,
	LogoutStudentController,
	RegisterStudentController,
	UpdateStudentDetailsByAdminController,
	UpdateStudentDetailsController,
} from '../../controller/student/student.controller.js';
import { roleRestriction } from '../../middlewares/roleRestriction.middleware.js';
import Student from '../../model/student/Student.model.js';
import validateObjectId from '../../middlewares/validateObjectId.middleware.js';

const studentRouter = Router();

const isAdmin = [isAuth(Admin), roleRestriction('admin')];
const isStudent = [isAuth(Student), roleRestriction('student')];

studentRouter
	.route('/register/admin')
	.post(
		[...isAdmin, uploadFileMulter.single('coverImage')],
		RegisterStudentController
	);

studentRouter.route('/login').post(LoginStudentController);

studentRouter
	.route('/logout')
	.get(...isStudent, LogoutStudentController);

// Admin-only routes for managing students
studentRouter
	.route('/admin')
	.get(...isAdmin, GetAllStudentsController);

studentRouter
	.route('/:id/admin')
	.get(validateObjectId, ...isAdmin, GetStudentByIdController);

studentRouter
	.route('/:id/update/admin')
	.put(
		[
			validateObjectId,
			...isAdmin,
			uploadFileMulter.single('coverImage'),
		],
		UpdateStudentDetailsByAdminController
	);

studentRouter
	.route('/:id/delete/admin')
	.delete([validateObjectId, ...isAdmin], DeleteStudentController);

// Student-specific routes for profile management
studentRouter
	.route('/profile')
	.get(...isStudent, GetStudentDetailsController);

studentRouter
	.route('/update')
	.put(...isStudent, UpdateStudentDetailsController);

export default studentRouter;
