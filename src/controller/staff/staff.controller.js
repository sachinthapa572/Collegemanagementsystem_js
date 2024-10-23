import AsyncHandler from 'express-async-handler';
import Admin from '../../model/Staff/Admin.model.js';
import ApiError from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { generateAccessTokenAndRefreshToken } from '../../utils/GenerateToken.js';
import { cookiesOptions } from '../../constant.js';
import { uploadOnCloudinary } from '../../utils/Images/cloudinary.js';

//* @desc Register a new Admin
//* @route POST /api/v1/admin/register
//* @access Private

export const RegisterAdminContoller = AsyncHandler(
	async (req, res) => {
		const { username, email, password } = req.body;
		const avatarLocalPath = req.file ? req.file?.path : null;
		if (!avatarLocalPath) {
			throw new ApiError(400, 'Please upload an image');
		}
		const existedUser = await Admin.findOne({
			$or: [{ email }, { username }],
		});

		if (existedUser) {
			throw new ApiError(400, 'Admin already exist');
		}

		// upload image to cloudinary
		const userImage = await uploadOnCloudinary(avatarLocalPath);
		if (!userImage?.url) {
			throw new ApiError(
				500,
				'Error occured while uploading image'
			);
		}

		const User = await Admin.create({
			username,
			email,
			password,
			refreshToken: '',
			userImage: userImage.url,
		});
		const curretUser = await Admin.findById(User._id).select(
			'-password -refreshToken'
		);
		if (!curretUser) {
			throw new ApiError(
				500,
				'Error occured while creating Admin'
			);
		}
		return res
			.status(201)
			.json(
				new ApiResponse(
					201,
					curretUser,
					'Admin created successfully'
				)
			);
	}
);

//* @desc Login Admin
//* @route POST /api/v1/admin/login
//* @access Private

export const LoginAdminContoller = AsyncHandler(async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		throw new ApiError(400, 'Please provide email and password');
	}

	// check if the admin exist in the database
	const Currentuser = await Admin.findOne({ email });
	if (!Currentuser) {
		throw new ApiError(404, 'Invalid credentials');
	}

	// check if the password match
	const isPasswordValid = await Currentuser.isPasswordCorrect(
		password
	);
	if (!isPasswordValid) {
		throw new ApiError(401, 'Invalid credentials');
	}

	const { refreshToken, accessToken } =
		await generateAccessTokenAndRefreshToken(Currentuser._id);

	const loginAdminDetails = await Admin.findById(
		Currentuser._id
	).select('-password -refreshToken');

	return res
		.status(200)
		.cookie('accessToken', accessToken, cookiesOptions)
		.cookie('refreshToken', refreshToken, cookiesOptions)
		.json(
			new ApiResponse(
				200,
				loginAdminDetails,
				'Admin logged in successfully'
			)
		);
});

//* @desc Get all Admins
//* @route GET /api/v1/admin
//* @access Private

export const GetAllAdminsContoller = (req, res) => {
	res.status(200).json({
		message: 'all admins info',
	});
};

//* @desc Get a single Admin
//* @route GET /api/v1/admin/:id
//* @access Private

export const GetSingleAdminContoller = (req, res) => {
	res.status(200).json({
		message: ' Single Admin Info ',
	});
};

//* @desc Update Admin Info
//* @route PUT /api/v1/admin/:id
//* @access Private

export const UpdateAdminContoller = (req, res) => {
	res.status(200).json({
		message: 'Update Admin Info',
	});
};

//* @desc Delete Admin Account
//* @route DELETE /api/v1/admin/:id
//* @access Private

export const DeleteAdminContoller = (req, res) => {
	res.status(200).json({
		message: 'Admin deleted successfully',
	});
};

//* @desc Suspend Teacher Account
//* @route PUT /api/v1/admin/suspend/teacher/:id
//* @access Private

export const SuspendTeacherContoller = (req, res) => {
	return res.status(200).json({
		message: 'Teacher suspended successfully',
	});
};

//* @desc Unsuspend Teacher Account
//* @route PUT /api/v1/admin/unsuspend/teacher/:id
//* @access Private

export const UnsuspendTeacherContoller = (req, res) => {
	res.status(200).json({
		message: 'Teacher unsuspended successfully',
	});
};

//* @desc Withdraw Teacher
//* @route PUT /api/v1/admin/withdraw/teacher/:id
//* @access Private

export const WithdrawTeacherContoller = (req, res) => {
	res.status(200).json({
		message: 'Teacher withdrawn successfully',
	});
};

//* @desc Unwithdraw Teacher
//* @route PUT /api/v1/admin/unwithdraw/teacher/:id
//* @access Private

export const UnwithdrawTeacherContoller = (req, res) => {
	res.status(200).json({
		message: ' Teacher unwithdrawn successfully',
	});
};

//* @desc Publish Exams
//* @route PUT /api/v1/admin/publish/exams/:id
//* @access Private

export const PublishExamsContoller = (req, res) => {
	res.status(200).json({
		message: 'Admin route',
	});
};

//* @desc Unpublish Exams
//* @route PUT /api/v1/admin/unpublish/exams/:id
//* @access Private

export const UnpublishExamsContoller = (req, res) => {
	res.status(200).json({
		message: 'Admin route',
	});
};
