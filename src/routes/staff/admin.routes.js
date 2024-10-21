import { Router } from 'express';

const adminRouter = Router();

// register a new admin
adminRouter.route('/register').post((req, res) => {
	res.status(201).json({
		message: 'Admin created successfully',
	});
});

// login the admin
adminRouter.route('/login').post((req, res) => {
	res.status(200).json({
		message: 'Admin logged in successfully',
	});
});

// get all admins
adminRouter.route('/').get((req, res) => {
	res.status(200).json({
		message: 'all admins info',
	});
});

// get a single admin info
adminRouter.route('/:id').get((req, res) => {
	res.status(200).json({
		message: ' Single Admin Info ',
	});
});

// update admin info
adminRouter.route('/:id').put((req, res) => {
	res.status(200).json({
		message: 'Update Admin Info',
	});
});

// delete admin account
adminRouter.route('/:id').delete((req, res) => {
	res.status(200).json({
		message: 'Admin deleted successfully',
	});
});

// suspend teacher account
adminRouter.route('/suspend/teacher/:id').put((req, res) => {
	res.status(200).json({
		message: 'Teacher suspended successfully',
	});
});

// unsuspend teacher account
adminRouter.route('/unsuspend/teacher/:id').put((req, res) => {
	res.status(200).json({
		message: 'Teacher unsuspended successfully',
	});
});

// withdraw teacher
adminRouter.route('/withdraw/teacher/:id').put((req, res) => {
	res.status(200).json({
		message: 'Teacher withdrawn successfully',
	});
});

// unwithdraw teacher
adminRouter.route('/unwithdraw/teacher/:id').put((req, res) => {
	res.status(200).json({
		message: ' Teacher unwithdrawn successfully',
	});
});

// publish exams
adminRouter.route('/publish/exams/:id').put((req, res) => {
	res.status(200).json({
		message: 'Admin route',
	});
});

// unpublish exams
adminRouter.route('/unpublish/exams/:id').put((req, res) => {
	res.status(200).json({
		message: 'Admin route',
	});
});

export default adminRouter;
