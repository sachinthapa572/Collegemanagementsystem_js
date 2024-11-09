import { Router } from 'express';
import { isAuth } from '../../middlewares/isAuth.middleware.js';
import { uploadFileMulter } from '../../middlewares/multer.middleware.js';
import validateObjectId from '../../middlewares/validateObjectId.middleware.js';
import Admin from '../../model/Staff/Admin.model.js';
import {
	DeleteTeacherController,
	GetAllTeachersController,
	GetCurrentTeacherController,
	GetSingleTeacherController,
	LoginTeacherController,
	LogoutTeacherController,
	RegisterTeacherController,
	UpdateTeacherController,
	UpdateTeacherControllerByAdmin,
} from '../../controller/staff/teacher.controller.js';
import Teacher from '../../model/Staff/Teacher.model.js';
import { roleRestriction } from '../../middlewares/roleRestriction.middleware.js';

const teacherRouter = Router();

const isAdmin = [isAuth(Admin), roleRestriction('admin')];
const isTeacher = [isAuth(Teacher), roleRestriction('teacher')];

// register a new admin
teacherRouter
	.route('/register/admin')
	.post(
		...isAdmin,
		uploadFileMulter.single('coverImage'),
		RegisterTeacherController
	);

// login the Teacher
teacherRouter.route('/login').post(LoginTeacherController);

// logout the Teacher
teacherRouter
	.route('/logout')
	.get(...isTeacher, LogoutTeacherController);

// get all Teachers
teacherRouter
	.route('/admin')
	.get(...isAdmin, GetAllTeachersController);

// get a current Teacher info
teacherRouter
	.route('/profile')
	.get(...isTeacher, GetCurrentTeacherController);

// get a specific  Teacher info
teacherRouter
	.route('/:teacherId/admin')
	.get(...isAdmin, GetSingleTeacherController);

// update Teacher info by Teacher
teacherRouter
	.route('/update')
	.put(
		...isTeacher,
		uploadFileMulter.single('coverImage'),
		UpdateTeacherController
	);

// update Teacher info by admin
teacherRouter
	.route('/:teacherId/update/admin')
	.put(
		...isAdmin,
		uploadFileMulter.single('coverImage'),
		UpdateTeacherControllerByAdmin
	);

// delete Teacher account
teacherRouter
	.route('/:teacherId/delete/admin')
	.delete(validateObjectId, ...isAdmin, DeleteTeacherController);

export default teacherRouter;
