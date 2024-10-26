import AsyncHandler from 'express-async-handler';
import Admin from '../../model/Staff/Admin.model.js';
import ApiError from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { generateAccessTokenAndRefreshToken } from '../../utils/GenerateToken.js';
import { cookiesOptions } from '../../constant.js';
import {
	deleteFromCloudinary,
	uploadOnCloudinary,
} from '../../utils/Images/cloudinary.js';
import removeMulterUploadFiles from '../../utils/Images/removeMulterUploadFiles.js';
import bcrypt from 'bcryptjs';
import {
	loginAdminSchema,
	registerAdminSchema,
	updateAdminSchema,
} from '../../schemas/Admin.schema.js';

//* @desc Register a new Admin
//* @route POST /api/v1/admin/register
//* @access Private

export const RegisterAdminController = AsyncHandler(
	async (req, res) => {
		const parsedBody = registerAdminSchema.parse(req.body);
		const { username, email, password, role } = parsedBody;
		const avatarLocalPath = req.file ? req.file?.path : null;
		if (!avatarLocalPath) {
			throw new ApiError(400, 'Please upload an image');
		}
		const existedUser = await Admin.findOne({
			$or: [{ email }, { username }],
		});

		if (existedUser) {
			removeMulterUploadFiles(avatarLocalPath);
			throw new ApiError(400, 'Admin already exist');
		}

		// upload image to cloudinary
		const userImage = await uploadOnCloudinary(avatarLocalPath);
		if (!userImage?.url) {
			removeMulterUploadFiles(avatarLocalPath);
			throw new ApiError(
				500,
				'Error occurred while uploading image'
			);
		}

		const User = await Admin.create({
			username,
			email,
			password,
			refreshToken: '',
			userImage: userImage.url,
			role,
		});
		const currentUser = await Admin.findById(User._id).select(
			'-password -refreshToken'
		);
		if (!currentUser) {
			throw new ApiError(
				500,
				'Error occurred while creating Admin'
			);
		}
		return res
			.status(201)
			.json(
				new ApiResponse(
					201,
					currentUser,
					'Admin created successfully'
				)
			);
	}
);

//* @desc Login Admin
//* @route POST /api/v1/admin/login
//* @access Private

export const LoginAdminController = AsyncHandler(async (req, res) => {
	// const { email, password } = req.body;
	const parsedBody = loginAdminSchema.parse(req.body);
	const { email, password } = parsedBody;

	if (!email || !password) {
		throw new ApiError(400, 'Please provide email and password');
	}

	// check if the admin exist in the database
	const currentUser = await Admin.findOne({ email });
	if (!currentUser) {
		throw new ApiError(404, "Email doesn't exist ");
	}

	// check if the password match
	const isPasswordValid = await currentUser.isPasswordCorrect(
		password
	);
	if (!isPasswordValid) {
		throw new ApiError(401, 'Invalid credentials');
	}

	const { refreshToken, accessToken } =
		await generateAccessTokenAndRefreshToken(currentUser._id);

	const loginAdminDetails = await Admin.findById(
		currentUser._id
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

export const GetAllAdminsController = AsyncHandler(async (_, res) => {
	const Admins = await Admin.find({}).select(
		'-password -refreshToken'
	);
	return res
		.status(200)
		.json(
			new ApiResponse(
				200,
				Admins,
				'All Admins fetched successfully'
			)
		);
});

//* @desc Get a specific Admin
//* @route GET /api/v1/admin/
//* @access Private

export const GetSpecificAdminController = AsyncHandler((req, res) => {
	return res
		.status(200)
		.json(new ApiResponse(200, req.user, 'Request Admin Details'));
});

//* @desc Get a specific Admin by email
//* @route GET /api/v1/admin/:email
//* @access Public

export const GetSingleAdminController = AsyncHandler(
	async (req, res) => {
		const { email } = req.query;
		singleAdminSchema.parse({ email });
		const CurrentAdmin = await Admin.findOne({
			email,
		});
		if (!CurrentAdmin) {
			throw new ApiError(404, 'Admin not found');
		}
		return res
			.status(200)
			.json(
				new ApiResponse(
					200,
					CurrentAdmin,
					'Admin fetched successfully'
				)
			);
	}
);

//* @desc Update Admin Info
//* @route PUT /api/v1/admin/:id
//* @access Private

export const UpdateAdminController = AsyncHandler(
	async (req, res) => {
		const parsedBody = updateAdminSchema.parse(req.body);
		const { username, email, oldPassword, newPassword } =
			parsedBody;
		const avatarLocalPath = req.file ? req.file.path : null;

		// Check if the current admin exists
		const currentAdmin = await Admin.findById(req.user._id);
		if (!currentAdmin) {
			if (avatarLocalPath)
				removeMulterUploadFiles(avatarLocalPath);
			throw new ApiError(404, 'Admin not found');
		}

		// Check if email is already in use by another admin
		if (email && email !== currentAdmin.email) {
			const emailExists = await Admin.findOne({ email });
			if (emailExists) {
				if (avatarLocalPath)
					removeMulterUploadFiles(avatarLocalPath);
				throw new ApiError(400, 'Email already exists');
			}
		}

		let userImage = currentAdmin.userImage;

		// Upload new image to Cloudinary if an image is provided
		if (avatarLocalPath) {
			const uploadedImage = await uploadOnCloudinary(
				avatarLocalPath
			);
			if (!uploadedImage?.url) {
				removeMulterUploadFiles(avatarLocalPath);
				throw new ApiError(500, 'Error uploading image');
			}

			// Delete old image from Cloudinary if upload is successful
			await deleteFromCloudinary(
				currentAdmin?.userImage?.split('/').pop()?.split('.')[0]
			);
			userImage = uploadedImage.url;
		}

		// Password update logic
		if (oldPassword && newPassword) {
			// check old password
			const isOldPasswordCorrect =
				await currentAdmin.isPasswordCorrect(oldPassword);
			if (!isOldPasswordCorrect) {
				throw new ApiError(401, 'Invalid old password');
			}

			// check new password is same as the previous password
			const isNewPasswordSame =
				await currentAdmin.isPasswordCorrect(newPassword);

			if (isNewPasswordSame) {
				throw new ApiError(
					400,
					'New password cannot be the same as the old password'
				);
			}

			// Hash the new password
			const salt = await bcrypt.genSalt(10);
			currentAdmin.password = await bcrypt.hash(newPassword, salt);
		}

		// Update admin details
		const updatedAdmin = await Admin.findByIdAndUpdate(
			req.user._id,
			{
				$set: {
					username,
					email,
					password: currentAdmin.password,
					userImage,
				},
			},
			{ new: true, runValidators: true }
		).select('-password -refreshToken');

		if (!updatedAdmin) {
			throw new ApiError(
				500,
				'Error occurred while updating Admin details'
			);
		}

		// Send a success response
		return res
			.status(200)
			.json(
				new ApiResponse(
					200,
					updatedAdmin,
					'Admin details updated successfully'
				)
			);
	}
);

//* @desc Delete Admin Account
//* @route DELETE /api/v1/admin/:id
//* @access Private

export const DeleteAdminController = (req, res) => {
	res.status(200).json({
		message: 'Admin deleted successfully',
	});
};

//* @desc Suspend Teacher Account
//* @route PUT /api/v1/admin/suspend/teacher/:id
//* @access Private

export const SuspendTeacherController = (req, res) => {
	return res.status(200).json({
		message: 'Teacher suspended successfully',
	});
};

//* @desc Unsuspend Teacher Account
//* @route PUT /api/v1/admin/unsuspend/teacher/:id
//* @access Private

export const UnsuspendTeacherController = (req, res) => {
	res.status(200).json({
		message: 'Teacher unsuspend successfully',
	});
};

//* @desc Withdraw Teacher
//* @route PUT /api/v1/admin/withdraw/teacher/:id
//* @access Private

export const WithdrawTeacherController = (req, res) => {
	res.status(200).json({
		message: 'Teacher withdrawn successfully',
	});
};

//* @desc Unwithdraw Teacher
//* @route PUT /api/v1/admin/unwithdraw/teacher/:id
//* @access Private

export const UnwithdrawTeacherController = (req, res) => {
	res.status(200).json({
		message: ' Teacher unwithdrawn successfully',
	});
};

//* @desc Publish Exams
//* @route PUT /api/v1/admin/publish/exams/:id
//* @access Private

export const PublishExamsController = (req, res) => {
	res.status(200).json({
		message: 'Admin route',
	});
};

//* @desc Unpublish Exams
//* @route PUT /api/v1/admin/unpublish/exams/:id
//* @access Private

export const UnpublishExamsController = (req, res) => {
	res.status(200).json({
		message: 'Admin route',
	});
};
