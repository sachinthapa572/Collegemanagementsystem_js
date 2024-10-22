import { Router } from 'express';
import {
	DeleteAdminContoller,
	GetAllAdminsContoller,
	GetSingleAdminContoller,
	LoginAdminContoller,
	PublishExamsContoller,
	RegisterAdminContoller,
	SuspendTeacherContoller,
	UnpublishExamsContoller,
	UnsuspendTeacherContoller,
	UnwithdrawTeacherContoller,
	UpdateAdminContoller,
	WithdrawTeacherContoller,
} from '../../controller/staff/staff.controller.js';
import { verifyJWT } from '../../middlewares/isAuth.middelware.js';

const adminRouter = Router();

// register a new admin
adminRouter.route('/register').post(RegisterAdminContoller);

// login the admin
adminRouter.route('/login').post(LoginAdminContoller);

// get all admins
adminRouter.route('/').get(verifyJWT, GetAllAdminsContoller);

// get a single admin info
adminRouter.route('/:id').get(GetSingleAdminContoller);

// update admin info
adminRouter.route('/:id').put(UpdateAdminContoller);

// delete admin account
adminRouter.route('/:id').delete(DeleteAdminContoller);

// suspend teacher account
adminRouter
	.route('/suspend/teacher/:id')
	.put(SuspendTeacherContoller);

// unsuspend teacher account
adminRouter
	.route('/unsuspend/teacher/:id')
	.put(UnsuspendTeacherContoller);

// withdraw teacher
adminRouter
	.route('/withdraw/teacher/:id')
	.put(WithdrawTeacherContoller);

// unwithdraw teacher
adminRouter
	.route('/unwithdraw/teacher/:id')
	.put(UnwithdrawTeacherContoller);

// publish exams
adminRouter.route('/publish/exams/:id').put(PublishExamsContoller);

// unpublish exams
adminRouter
	.route('/unpublish/exams/:id')
	.put(UnpublishExamsContoller);

export default adminRouter;
