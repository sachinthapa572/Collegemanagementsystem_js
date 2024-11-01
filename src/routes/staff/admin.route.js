import { Router } from 'express';
import {
	DeleteAdminController,
	GetAllAdminsController,
	GetSingleAdminController,
	GetSpecificAdminController,
	LoginAdminController,
	LogoutAdminController,
	PublishExamsController,
	RegisterAdminController,
	SuspendTeacherController,
	UnpublishExamsController,
	UnsuspendTeacherController,
	UnwithdrawTeacherController,
	UpdateAdminController,
	WithdrawTeacherController,
} from '../../controller/staff/staff.controller.js';
import { isAuth } from '../../middlewares/isAuth.middleware.js';
import { uploadFileMulter } from '../../middlewares/multer.middleware.js';
import { isAdmin } from '../../middlewares/isAdmin.middleware.js';
import validateObjectId from '../../middlewares/validateObjectId.middleware.js';
import Admin from '../../model/Staff/Admin.model.js';

const adminRouter = Router();

// register a new admin
adminRouter
	.route('/register')
	.post(
		uploadFileMulter.single('coverImage'),
		RegisterAdminController
	);

// login the admin
adminRouter.route('/login').post(LoginAdminController);

// logout the admin
adminRouter
	.route('/logout')
	.post(isAuth(Admin), LogoutAdminController);

// get all admins
adminRouter
	.route('/')
	.get(isAuth(Admin), isAdmin, GetAllAdminsController);

// get a specific  admin info
adminRouter
	.route('/currentAdmin-profile')
	.get(isAuth(Admin), GetSpecificAdminController);

// get a specific admin info by email
adminRouter.route('/profile').get(GetSingleAdminController);

// update admin info
adminRouter
	.route('/')
	.put(
		uploadFileMulter.single('coverImage'),
		isAuth(Admin),
		isAdmin,
		UpdateAdminController
	);

// delete admin account
adminRouter
	.route('/:id')
	.delete(
		isAuth(Admin),
		isAdmin,
		validateObjectId,
		DeleteAdminController
	);

// suspend teacher account
adminRouter
	.route('/suspend/teacher/:id')
	.put(
		isAuth(Admin),
		isAdmin,
		validateObjectId,
		SuspendTeacherController
	);

// unsuspend teacher account
adminRouter
	.route('/unsuspend/teacher/:id')
	.put(
		isAuth(Admin),
		isAdmin,
		validateObjectId,
		UnsuspendTeacherController
	);

// withdraw teacher
adminRouter
	.route('/withdraw/teacher/:id')
	.put(
		isAuth(Admin),
		isAdmin,
		validateObjectId,
		WithdrawTeacherController
	);

// unwithdraw teacher
adminRouter
	.route('/unwithdraw/teacher/:id')
	.put(
		isAuth(Admin),
		isAdmin,
		validateObjectId,
		UnwithdrawTeacherController
	);

// publish exams
adminRouter
	.route('/publish/exams/:id')
	.put(
		isAuth(Admin),
		isAdmin,
		validateObjectId,
		PublishExamsController
	);

// unpublish exams
adminRouter
	.route('/unpublish/exams/:id')
	.put(
		isAuth(Admin),
		isAdmin,
		validateObjectId,
		UnpublishExamsController
	);

export default adminRouter;
