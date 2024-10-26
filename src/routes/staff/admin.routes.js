import { Router } from 'express';
import {
	DeleteAdminController,
	GetAllAdminsController,
	GetSingleAdminController,
	GetSpecificAdminController,
	LoginAdminController,
	PublishExamsController,
	RegisterAdminController,
	SuspendTeacherController,
	UnpublishExamsController,
	UnsuspendTeacherController,
	UnwithdrawTeacherController,
	UpdateAdminController,
	WithdrawTeacherController,
} from '../../controller/staff/staff.controller.js';
import { verifyJWT } from '../../middlewares/isAuth.middleware.js';
import { uploadFileMulter } from '../../middlewares/multer.middleware.js';
import { isAdmin } from '../../middlewares/isAdmin.middleware.js';

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

// get all admins
adminRouter
	.route('/')
	.get(verifyJWT, isAdmin, GetAllAdminsController);

// get a specific  admin info
adminRouter
	.route('/currentAdmin-profile')
	.get(verifyJWT, GetSpecificAdminController);

// get a specific admin info by email
adminRouter.route('/profile').get(GetSingleAdminController);

// update admin info
adminRouter
	.route('/')
	.put(
		uploadFileMulter.single('coverImage'),
		verifyJWT,
		isAdmin,
		UpdateAdminController
	);

// delete admin account
adminRouter.route('/:id').delete(DeleteAdminController);

// suspend teacher account
adminRouter
	.route('/suspend/teacher/:id')
	.put(SuspendTeacherController);

// unsuspend teacher account
adminRouter
	.route('/unsuspend/teacher/:id')
	.put(UnsuspendTeacherController);

// withdraw teacher
adminRouter
	.route('/withdraw/teacher/:id')
	.put(WithdrawTeacherController);

// unwithdraw teacher
adminRouter
	.route('/unwithdraw/teacher/:id')
	.put(UnwithdrawTeacherController);

// publish exams
adminRouter.route('/publish/exams/:id').put(PublishExamsController);

// unpublish exams
adminRouter
	.route('/unpublish/exams/:id')
	.put(UnpublishExamsController);

export default adminRouter;
