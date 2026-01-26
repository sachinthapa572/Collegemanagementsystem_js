import AsyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import Teacher from '../../model/Staff/Teacher.model.js';
import ApiError from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { generateAccessTokenAndRefreshToken } from '../../utils/authTokenGenerator.js';
import { cookiesOptions } from '../../constant.js';
import {
	deleteFromCloudinary,
	uploadOnCloudinary,
} from '../../utils/Images/cloudinary.js';
import removeMulterUploadFiles from '../../utils/Images/removeMulterUploadFiles.js';
import {
	loginAdminSchema,
	registerAdminSchema,
	updateAdminSchema,
	updateAdminSchemaByAdmin,
} from '../../utils/Validation/admin.schema.js';
import Admin from '../../model/Staff/Admin.model.js';
import sendMail from '../../utils/mail/nodeMailer.js';

//* @desc Register a new Teacher
//* @route POST /api/v1/teachers/register/admin
//* @access Private

export const RegisterTeacherController = AsyncHandler(
	async (req, res) => {
		console.log(req.body);
		const createdBy = req?.user?._id;

		const { username, email, password } = registerAdminSchema.parse(
			req.body
		);

		const avatarLocalPath = req.file ? req.file?.path : null;
		if (!avatarLocalPath) {
			throw new ApiError(400, 'Please upload an image');
		}
		const existedUser = await Teacher.findOne({
			$or: [
				{
					email,
				},
				{
					username,
				},
			],
		});

		if (existedUser) {
			removeMulterUploadFiles(avatarLocalPath);
			throw new ApiError(400, 'Teacher already exist');
		}

		// upload image to cloudinary
		const userImage = await uploadOnCloudinary(
			avatarLocalPath,
			'Teachers'
		);
		if (!userImage?.url) {
			removeMulterUploadFiles(avatarLocalPath);
			throw new ApiError(
				500,
				'Error occurred while uploading image'
			);
		}

		const User = await Teacher.create({
			username,
			email,
			password,
			refreshToken: '',
			userImage: userImage.url,
			createdBy,
		});
		const currentUser = await Teacher.findById(User._id).select(
			'-password -refreshToken'
		);
		if (!currentUser) {
			throw new ApiError(
				500,
				'Error occurred while creating Teacher'
			);
		}

		await Admin.updateOne(
			{
				_id: req.user._id,
			},
			{
				$push: {
					teachers: currentUser._id,
				},
			}
		);

		// await sendMail(currentUser);
		return res
			.status(201)
			.json(
				new ApiResponse(
					201,
					currentUser,
					'Teacher created successfully'
				)
			);
	}
);

//* @desc Login Teacher
//* @route POST /api/v1/teachers/login
//* @access Public

export const LoginTeacherController = AsyncHandler(
	async (req, res, next) => {
		// const { email, password } = req.body;
		const parsedBody = loginAdminSchema.parse(req.body);
		const { email, password } = parsedBody;

		// check if the Teacher exist in the database
		const currentUser = await Teacher.findOne({ email });
		if (!currentUser) {
			throw new ApiError(404, "Email doesn't exist");
		}

		// check if the password match
		const isPasswordValid =
			await currentUser.isPasswordCorrect(password);
		if (!isPasswordValid) {
			throw new ApiError(401, 'Invalid credentials');
		}

		const { refreshToken, accessToken } =
			await generateAccessTokenAndRefreshToken(
				Teacher,
				currentUser._id,
				next
			);

		let loginTeacherDetails = await Teacher.findById(
			currentUser._id
		).select('-password -refreshToken');

		loginTeacherDetails = {
			...loginTeacherDetails._doc,
			accessToken: `Bearer ${accessToken}`,
			refreshToken: `Bearer ${refreshToken}`,
		};
		return res
			.status(200)
			.cookie('accessToken', accessToken, cookiesOptions)
			.cookie('refreshToken', refreshToken, cookiesOptions)
			.json(
				new ApiResponse(
					200,
					loginTeacherDetails,
					'Teacher logged in successfully'
				)
			);
	}
);

//* @desc get all Teachers
//* @route GET /api/v1/teachers/admin
//* @access Private

export const GetAllTeachersController = AsyncHandler(
	async (req, res) => {
		const { page = 1, limit = 10 } = req.query;

		const Teachers = await Teacher.find({})
			.select('-password -refreshToken')
			.skip((page - 1) * limit)
			.limit(limit);

		const total = await Teacher.countDocuments({});

		return res.status(200).json(
			new ApiResponse(
				200,
				{
					Teachers,
					total,
					page,
					limit,
				},
				'All Teachers fetched successfully'
			)
		);
	}
);

//* @desc Get a specific Teacher
//* @route GET /api/v1/teachers/profile
//* @access Private

export const GetCurrentTeacherController = AsyncHandler(
	async (req, res) => {
		const TeacherDetail = await Teacher.findById(req.user._id)
			.select('-password -refreshToken')
			.populate('createdBy', 'username -_id');

		return res
			.status(200)
			.json(
				new ApiResponse(
					200,
					TeacherDetail,
					'Request Teacher Details'
				)
			);
	}
);

//* @desc Get a specific Teacher by id
// * @route GET /api/v1/teachers/teacherId/admin
//* @access Public

export const GetSingleTeacherController = AsyncHandler(
	async (req, res) => {
		const teacherId = req.params.teacherId;
		if (!teacherId) {
			throw new ApiError(400, 'Teacher Id is required');
		}
		const CurrentTeacher = await Teacher.findById(teacherId).select(
			'-password -refreshToken'
		);

		if (!CurrentTeacher) {
			throw new ApiError(
				404,
				'Teacher details not found for this id'
			);
		}

		return res
			.status(200)
			.json(
				new ApiResponse(
					200,
					CurrentTeacher,
					'Request Teacher Details'
				)
			);
	}
);

//* @desc Update Teacher Info
//* @route PUT /api/v1/teachers/update
//* @access Private

export const UpdateTeacherController = AsyncHandler(
	async (req, res) => {
		const avatarLocalPath = req.file ? req.file.path : null;
		let { username, email, oldPassword, newPassword } = req.body;
		if (!avatarLocalPath) {
			let { username, email, oldPassword, newPassword } =
				updateAdminSchema.parse(req.body);
		}

		// Check if the current Teacher exists
		const currentTeacher = await Teacher.findById(req.user._id);
		if (!currentTeacher) {
			if (avatarLocalPath)
				removeMulterUploadFiles(avatarLocalPath);
			throw new ApiError(404, 'Teacher not found');
		}

		// Check if email is already in use by another Teacher
		if (email && email !== currentTeacher.email) {
			const emailExists = await Teacher.findOne({ email });
			if (emailExists) {
				if (avatarLocalPath)
					removeMulterUploadFiles(avatarLocalPath);
				throw new ApiError(400, 'Email already exists');
			}
		}

		let userImage = currentTeacher.userImage;

		// Upload new image to Cloudinary if an image is provided
		if (avatarLocalPath) {
			const uploadedImage = await uploadOnCloudinary(
				avatarLocalPath,
				'Teachers'
			);
			if (!uploadedImage?.url) {
				removeMulterUploadFiles(avatarLocalPath);
				throw new ApiError(500, 'Error uploading image');
			}

			// Delete old image from Cloudinary if upload is successful
			await deleteFromCloudinary(
				currentTeacher?.userImage?.split('/').pop()?.split('.')[0]
			);
			userImage = uploadedImage.url;
		}

		// Password update logic
		if (oldPassword && newPassword) {
			// check old password
			const isOldPasswordCorrect =
				await currentTeacher.isPasswordCorrect(oldPassword);
			if (!isOldPasswordCorrect) {
				throw new ApiError(401, 'Invalid old password');
			}

			// check new password is same as the previous password
			const isNewPasswordSame =
				await currentTeacher.isPasswordCorrect(newPassword);

			if (isNewPasswordSame) {
				throw new ApiError(
					400,
					'New password cannot be the same as the old password'
				);
			}

			// Hash the new password
			const salt = await bcrypt.genSalt(10);
			currentTeacher.password = await bcrypt.hash(
				newPassword,
				salt
			);
		}

		// Update Teacher details
		const updatedTeacher = await Teacher.findByIdAndUpdate(
			req.user._id,
			{
				$set: {
					username,
					email,
					password: currentTeacher.password,
					userImage,
				},
			},
			{
				new: true,
				runValidators: true,
			}
		).select('-password -refreshToken');

		if (!updatedTeacher) {
			throw new ApiError(
				500,
				'Error occurred while updating Teacher details'
			);
		}

		// Send a success response
		return res
			.status(200)
			.json(
				new ApiResponse(
					200,
					updatedTeacher,
					'Teacher details updated successfully'
				)
			);
	}
);

//* @desc Update Teacher Info by Admin
//* @route PUT /api/v1/Teacher/:teacherId/update/admin
//* @access Private

export const UpdateTeacherControllerByAdmin = AsyncHandler(
	async (req, res) => {
		const avatarLocalPath = req.file ? req.file.path : null;
		let { username, email } = req.body;
		if (!avatarLocalPath) {
			let { username, email } = updateAdminSchemaByAdmin.parse(
				req.body
			);
		}

		const { teacherId } = req.params;
		if (!teacherId) {
			throw new ApiError(400, 'Teacher Id is required');
		}
		// Check if the Teacher exists
		const currentTeacher = await Teacher.findById(teacherId);
		if (!currentTeacher) {
			if (avatarLocalPath)
				removeMulterUploadFiles(avatarLocalPath);
			throw new ApiError(404, 'Teacher not found');
		}

		// Check if email is already in use by another Teacher
		if (email && email !== currentTeacher.email) {
			const emailExists = await Teacher.findOne({ email });
			if (emailExists) {
				if (avatarLocalPath)
					removeMulterUploadFiles(avatarLocalPath);
				throw new ApiError(400, 'Email already exists');
			}
		}

		let userImage = currentTeacher.userImage;

		// Upload new image to Cloudinary if an image is provided
		if (avatarLocalPath) {
			const uploadedImage =
				await uploadOnCloudinary(avatarLocalPath);
			if (!uploadedImage?.url) {
				removeMulterUploadFiles(avatarLocalPath);
				throw new ApiError(500, 'Error uploading image');
			}

			// Delete old image from Cloudinary if upload is successful
			await deleteFromCloudinary(
				currentTeacher?.userImage?.split('/').pop()?.split('.')[0]
			);
			userImage = uploadedImage.url;
		}

		// Update Teacher details
		const updatedTeacher = await Teacher.findByIdAndUpdate(
			teacherId,
			{
				$set: {
					username,
					email,
					userImage,
				},
			},
			{
				new: true,
				runValidators: true,
			}
		).select('-password -refreshToken');

		if (!updatedTeacher) {
			throw new ApiError(
				500,
				'Error occurred while updating Teacher details'
			);
		}

		// Send a success response
		return res
			.status(200)
			.json(
				new ApiResponse(
					200,
					updatedTeacher,
					'Teacher details updated successfully'
				)
			);
	}
);

//* @desc Delete Teacher Account
//* @route DELETE /api/v1/Teacher/teacherId/delete/admin
//* @access Private

export const DeleteTeacherController = AsyncHandler(
	async (req, res) => {
		const { teacherId } = req.params;
		const deletedTeacher = await Teacher.findByIdAndDelete(
			teacherId
		).select('username email -_id');
		if (!deletedTeacher) {
			throw new ApiError(404, 'Teacher not found');
		}
		await deleteFromCloudinary(
			deletedTeacher?.userImage?.split('/').pop()?.split('.')[0]
		);
		return res
			.status(200)
			.json(
				new ApiResponse(
					200,
					deletedTeacher,
					'Teacher deleted successfully'
				)
			);
	}
);

//* @desc Logout Teacher
//* @route POST /api/v1/teachers/logout
//* @access Private

export const LogoutTeacherController = AsyncHandler(
	async (req, res) => {
		const currentTeacher = await Teacher.findById(req.user._id);
		if (!currentTeacher) {
			throw new ApiError(404, 'Teacher not found');
		}

		currentTeacher.refreshToken = '';
		await currentTeacher.save();

		res.clearCookie('accessToken');
		res.clearCookie('refreshToken');
		return res
			.status(200)
			.json(
				new ApiResponse(
					200,
					{},
					'Teacher logged out successfully'
				)
			);
	}
);
