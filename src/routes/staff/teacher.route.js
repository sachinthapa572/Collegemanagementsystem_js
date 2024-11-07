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
	RefreshTeacherTokenController,
	RegisterTeacherController,
	UpdateTeacherController,
	UpdateTeacherControllerByAdmin,
} from '../../controller/staff/teacher.controller.js';
import Teacher from '../../model/Staff/Teacher.model.js';
import { roleRestriction } from '../../middlewares/roleRestriction.middleware.js';

const teacherRouter = Router();

// register a new admin
teacherRouter
	.route('/register/admin')
	.post(
		isAuth(Admin),
		roleRestriction('admin'),
		uploadFileMulter.single('coverImage'),
		RegisterTeacherController
	);

// login the Teacher
teacherRouter.route('/login').post(LoginTeacherController);

// logout the Teacher
teacherRouter
	.route('/logout')
	.get(
		isAuth(Teacher),
		roleRestriction('teacher'),
		LogoutTeacherController
	);

// get all Teachers
teacherRouter
	.route('/admin')
	.get(
		isAuth(Admin),
		roleRestriction('admin'),
		GetAllTeachersController
	);

// get a current Teacher info
teacherRouter
	.route('/profile')
	.get(
		isAuth(Teacher),
		roleRestriction('teacher'),
		GetCurrentTeacherController
	);

// get a specific  Teacher info
teacherRouter
	.route('/:teacherId/admin')
	.get(
		isAuth(Admin),
		roleRestriction('admin'),
		GetSingleTeacherController
	);

// update Teacher info by Teacher
teacherRouter
	.route('/update')
	.put(
		uploadFileMulter.single('coverImage'),
		isAuth(Teacher),
		roleRestriction('teacher'),
		UpdateTeacherController
	);

// update Teacher info by admin
teacherRouter
	.route('/:teacherId/update/admin')
	.put(
		uploadFileMulter.single('coverImage'),
		isAuth(Admin),
		roleRestriction('admin'),
		UpdateTeacherControllerByAdmin
	);

// delete Teacher account
teacherRouter
	.route('/:teacherId/delete/admin')
	.delete(
		isAuth(Admin),
		roleRestriction('admin'),
		validateObjectId,
		DeleteTeacherController
	);

export default teacherRouter;
