//@desc Register a new Admin
//@route POST /api/v1/admin/register
//@access Private
export const RegisterAdminContoller = (req, res) => {
	res.status(201).json({
		message: 'Admin created successfully',
	});
};

//@desc Login Admin
//@route POST /api/v1/admin/login
//@access Private

export const LoginAdminContoller = (req, res) => {
	res.status(200).json({
		message: 'Admin logged in successfully',
	});
};

//@desc Get all Admins
//@route GET /api/v1/admin
//@access Private

export const GetAllAdminsContoller = (req, res) => {
	res.status(200).json({
		message: 'all admins info',
	});
};

//@desc Get a single Admin
//@route GET /api/v1/admin/:id
//@access Private

export const GetSingleAdminContoller = (req, res) => {
	res.status(200).json({
		message: ' Single Admin Info ',
	});
};

//@desc Update Admin Info
//@route PUT /api/v1/admin/:id
//@access Private

export const UpdateAdminContoller = (req, res) => {
	res.status(200).json({
		message: 'Update Admin Info',
	});
};

//@desc Delete Admin Account
//@route DELETE /api/v1/admin/:id
//@access Private

export const DeleteAdminContoller = (req, res) => {
	res.status(200).json({
		message: 'Admin deleted successfully',
	});
};

//@desc Suspend Teacher Account
//@route PUT /api/v1/admin/suspend/teacher/:id
//@access Private

export const SuspendTeacherContoller = (req, res) => {
	return res.status(200).json({
		message: 'Teacher suspended successfully',
	});
};

//@desc Unsuspend Teacher Account
//@route PUT /api/v1/admin/unsuspend/teacher/:id
//@access Private

export const UnsuspendTeacherContoller = (req, res) => {
	res.status(200).json({
		message: 'Teacher unsuspended successfully',
	});
};

//@desc Withdraw Teacher
//@route PUT /api/v1/admin/withdraw/teacher/:id
//@access Private

export const WithdrawTeacherContoller = (req, res) => {
	res.status(200).json({
		message: 'Teacher withdrawn successfully',
	});
};

//@desc Unwithdraw Teacher
//@route PUT /api/v1/admin/unwithdraw/teacher/:id
//@access Private

export const UnwithdrawTeacherContoller = (req, res) => {
	res.status(200).json({
		message: ' Teacher unwithdrawn successfully',
	});
};

//@desc Publish Exams
//@route PUT /api/v1/admin/publish/exams/:id
//@access Private

export const PublishExamsContoller = (req, res) => {
	res.status(200).json({
		message: 'Admin route',
	});
};

//@desc Unpublish Exams
//@route PUT /api/v1/admin/unpublish/exams/:id
//@access Private

export const UnpublishExamsContoller = (req, res) => {
	res.status(200).json({
		message: 'Admin route',
	});
};
